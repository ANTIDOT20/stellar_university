#![no_std]

//! SEP-31 anchor escrow contract.
//! Receives USDC from off-chain payment rails and forwards to the tuition treasury.

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    token, Address, Env, String,
};

#[contracttype]
#[derive(Clone, PartialEq)]
pub enum TransferStatus {
    Pending,
    Completed,
    Refunded,
    Expired,
}

#[contracttype]
#[derive(Clone)]
pub struct AnchorTransfer {
    pub id:            String,
    pub sender:        Address,
    pub recipient:     Address,
    pub asset:         Address,
    pub amount:        i128,
    pub memo:          String,
    pub status:        TransferStatus,
    pub initiated_at:  u64,
    pub completed_at:  Option<u64>,
    pub expires_at:    u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    AnchorOperator,
    Token,
    TuitionContract,
    Transfer(String),
    TransferCount,
}

#[contracttype]
pub enum ContractError {
    AlreadyInitialized,
    NotInitialized,
    Unauthorized,
    TransferNotFound,
    TransferAlreadyCompleted,
    TransferExpired,
    InvalidAmount,
}

const TRANSFER_TTL: u64 = 86_400; // 24 hours

#[contract]
pub struct AnchorContract;

#[contractimpl]
impl AnchorContract {
    pub fn initialize(
        env:              Env,
        admin:            Address,
        anchor_operator:  Address,
        token:            Address,
        tuition_contract: Address,
    ) -> Result<(), ContractError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(ContractError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::AnchorOperator, &anchor_operator);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage()
            .instance()
            .set(&DataKey::TuitionContract, &tuition_contract);
        env.storage().instance().set(&DataKey::TransferCount, &0u32);
        Ok(())
    }

    /// Called by off-chain anchor backend when fiat payment is confirmed.
    pub fn initiate_transfer(
        env:       Env,
        operator:  Address,
        tx_id:     String,
        sender:    Address,
        recipient: Address,
        amount:    i128,
        memo:      String,
    ) -> Result<(), ContractError> {
        Self::require_operator(&env, &operator)?;

        if amount <= 0 {
            return Err(ContractError::InvalidAmount);
        }

        let transfer = AnchorTransfer {
            id:           tx_id.clone(),
            sender:       sender.clone(),
            recipient:    recipient.clone(),
            asset:        env.storage().instance().get(&DataKey::Token).unwrap(),
            amount,
            memo,
            status:       TransferStatus::Pending,
            initiated_at: env.ledger().timestamp(),
            completed_at: None,
            expires_at:   env.ledger().timestamp() + TRANSFER_TTL,
        };
        env.storage()
            .persistent()
            .set(&DataKey::Transfer(tx_id.clone()), &transfer);

        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::TransferCount)
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::TransferCount, &(count + 1));

        env.events().publish(
            (symbol_short!("anchor"), symbol_short!("init")),
            (tx_id, sender, recipient, amount),
        );
        Ok(())
    }

    /// Complete a transfer — moves tokens from escrow to recipient.
    pub fn complete_transfer(
        env:      Env,
        operator: Address,
        tx_id:    String,
    ) -> Result<(), ContractError> {
        Self::require_operator(&env, &operator)?;

        let mut transfer: AnchorTransfer = env
            .storage()
            .persistent()
            .get(&DataKey::Transfer(tx_id.clone()))
            .ok_or(ContractError::TransferNotFound)?;

        if transfer.status != TransferStatus::Pending {
            return Err(ContractError::TransferAlreadyCompleted);
        }
        if env.ledger().timestamp() > transfer.expires_at {
            return Err(ContractError::TransferExpired);
        }

        let token_client = token::Client::new(&env, &transfer.asset);
        let contract_addr = env.current_contract_address();
        token_client.transfer(&contract_addr, &transfer.recipient, &transfer.amount);

        transfer.status       = TransferStatus::Completed;
        transfer.completed_at = Some(env.ledger().timestamp());
        env.storage()
            .persistent()
            .set(&DataKey::Transfer(tx_id.clone()), &transfer);

        env.events().publish(
            (symbol_short!("anchor"), symbol_short!("done")),
            (tx_id, transfer.recipient, transfer.amount),
        );
        Ok(())
    }

    pub fn refund(
        env:      Env,
        operator: Address,
        tx_id:    String,
    ) -> Result<(), ContractError> {
        Self::require_operator(&env, &operator)?;

        let mut transfer: AnchorTransfer = env
            .storage()
            .persistent()
            .get(&DataKey::Transfer(tx_id.clone()))
            .ok_or(ContractError::TransferNotFound)?;

        if transfer.status != TransferStatus::Pending {
            return Err(ContractError::TransferAlreadyCompleted);
        }

        let token_client = token::Client::new(&env, &transfer.asset);
        let contract_addr = env.current_contract_address();
        token_client.transfer(&contract_addr, &transfer.sender, &transfer.amount);

        transfer.status = TransferStatus::Refunded;
        env.storage()
            .persistent()
            .set(&DataKey::Transfer(tx_id.clone()), &transfer);
        Ok(())
    }

    pub fn get_transfer(env: Env, tx_id: String) -> Result<AnchorTransfer, ContractError> {
        env.storage()
            .persistent()
            .get(&DataKey::Transfer(tx_id))
            .ok_or(ContractError::TransferNotFound)
    }

    pub fn transfer_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::TransferCount).unwrap_or(0)
    }

    fn require_operator(env: &Env, caller: &Address) -> Result<(), ContractError> {
        caller.require_auth();
        let operator: Address = env
            .storage()
            .instance()
            .get(&DataKey::AnchorOperator)
            .ok_or(ContractError::NotInitialized)?;
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(ContractError::NotInitialized)?;
        if *caller != operator && *caller != admin {
            return Err(ContractError::Unauthorized);
        }
        Ok(())
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{
        testutils::{Address as _, Ledger},
        Env,
    };

    fn setup() -> (Env, Address, Address, Address, Address) {
        let env      = Env::default();
        env.mock_all_auths();
        let id       = env.register_contract(None, AnchorContract);
        let admin    = Address::generate(&env);
        let operator = Address::generate(&env);
        let token    = Address::generate(&env);
        let tuition  = Address::generate(&env);
        let client   = AnchorContractClient::new(&env, &id);
        client.initialize(&admin, &operator, &token, &tuition);
        (env, id, admin, operator, token)
    }

    #[test]
    fn test_initiate_transfer() {
        let (env, id, _, operator, _) = setup();
        let client    = AnchorContractClient::new(&env, &id);
        let sender    = Address::generate(&env);
        let recipient = Address::generate(&env);

        client.initiate_transfer(
            &operator,
            &String::from_str(&env, "TX001"),
            &sender,
            &recipient,
            &1_500_000_000i128,
            &String::from_str(&env, "tuition"),
        );
        assert_eq!(client.transfer_count(), 1);

        let t = client.get_transfer(&String::from_str(&env, "TX001"));
        assert!(matches!(t.status, TransferStatus::Pending));
        assert_eq!(t.amount, 1_500_000_000i128);
    }

    #[test]
    fn test_invalid_amount_rejected() {
        let (env, id, _, operator, _) = setup();
        let client = AnchorContractClient::new(&env, &id);
        let sender    = Address::generate(&env);
        let recipient = Address::generate(&env);

        let res = client.try_initiate_transfer(
            &operator,
            &String::from_str(&env, "TX_BAD"),
            &sender,
            &recipient,
            &0i128,
            &String::from_str(&env, ""),
        );
        assert!(res.is_err());
    }

    #[test]
    fn test_unauthorized_operator_rejected() {
        let (env, id, _, _, _) = setup();
        let client   = AnchorContractClient::new(&env, &id);
        let stranger = Address::generate(&env);
        let sender   = Address::generate(&env);
        let recipient = Address::generate(&env);

        let res = client.try_initiate_transfer(
            &stranger,
            &String::from_str(&env, "TX_UNAUTH"),
            &sender,
            &recipient,
            &1_000_000_000i128,
            &String::from_str(&env, ""),
        );
        assert!(res.is_err());
    }
}
