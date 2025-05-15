#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    token, Address, Env, String,
};

#[contracttype]
#[derive(Clone)]
pub enum PaymentStatus {
    Pending,
    Confirmed,
    Refunded,
}

#[contracttype]
#[derive(Clone)]
pub struct TuitionPayment {
    pub student:  Address,
    pub session:  String,
    pub semester: u32,
    pub amount:   i128,
    pub asset:    Address,
    pub status:   PaymentStatus,
    pub paid_at:  u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Token,
    Treasury,
    Fee(u32),
    Payment(Address, String, u32),
    PaymentCount,
}

#[contracttype]
pub enum ContractError {
    AlreadyInitialized,
    NotInitialized,
    Unauthorized,
    AlreadyPaid,
    PaymentNotFound,
    InsufficientAmount,
    TransferFailed,
}

#[contract]
pub struct TuitionContract;

#[contractimpl]
impl TuitionContract {
    pub fn initialize(
        env:      Env,
        admin:    Address,
        token:    Address,
        treasury: Address,
    ) -> Result<(), ContractError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(ContractError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::Treasury, &treasury);
        env.storage().instance().set(&DataKey::PaymentCount, &0u32);

        // Default fees by level (in USDC stroops: 7 decimals)
        // 100-200 level: 150_000_0000000 = 150 USDC
        for (level, fee) in [(100u32, 1_500_000_000i128), (200, 1_500_000_000),
                              (300, 2_000_000_000), (400, 2_000_000_000),
                              (500, 2_500_000_000), (600, 2_500_000_000),
                              (700, 3_000_000_000)] {
            env.storage().instance().set(&DataKey::Fee(level), &fee);
        }
        Ok(())
    }

    pub fn set_fee(
        env:    Env,
        caller: Address,
        level:  u32,
        amount: i128,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &caller)?;
        env.storage().instance().set(&DataKey::Fee(level), &amount);
        Ok(())
    }

    pub fn pay(
        env:      Env,
        student:  Address,
        session:  String,
        semester: u32,
        level:    u32,
    ) -> Result<(), ContractError> {
        student.require_auth();

        let key = DataKey::Payment(student.clone(), session.clone(), semester);
        if env.storage().persistent().has(&key) {
            return Err(ContractError::AlreadyPaid);
        }

        let fee: i128 = env
            .storage()
            .instance()
            .get(&DataKey::Fee(level))
            .ok_or(ContractError::InsufficientAmount)?;

        let token_addr: Address = env
            .storage()
            .instance()
            .get(&DataKey::Token)
            .ok_or(ContractError::NotInitialized)?;
        let treasury: Address = env
            .storage()
            .instance()
            .get(&DataKey::Treasury)
            .ok_or(ContractError::NotInitialized)?;

        let token_client = token::Client::new(&env, &token_addr);
        token_client.transfer(&student, &treasury, &fee);

        let record = TuitionPayment {
            student:  student.clone(),
            session:  session.clone(),
            semester,
            amount:   fee,
            asset:    token_addr,
            status:   PaymentStatus::Confirmed,
            paid_at:  env.ledger().timestamp(),
        };
        env.storage().persistent().set(&key, &record);

        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::PaymentCount)
            .unwrap_or(0);
        env.storage().instance().set(&DataKey::PaymentCount, &(count + 1));

        env.events().publish(
            (symbol_short!("tuition"), symbol_short!("paid")),
            (student, session, semester, fee),
        );
        Ok(())
    }

    pub fn is_paid(env: Env, student: Address, session: String, semester: u32) -> bool {
        env.storage()
            .persistent()
            .has(&DataKey::Payment(student, session, semester))
    }

    pub fn get_payment(
        env:      Env,
        student:  Address,
        session:  String,
        semester: u32,
    ) -> Result<TuitionPayment, ContractError> {
        env.storage()
            .persistent()
            .get(&DataKey::Payment(student, session, semester))
            .ok_or(ContractError::PaymentNotFound)
    }

    pub fn get_fee(env: Env, level: u32) -> i128 {
        env.storage().instance().get(&DataKey::Fee(level)).unwrap_or(0)
    }

    fn require_admin(env: &Env, caller: &Address) -> Result<(), ContractError> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(ContractError::NotInitialized)?;
        if *caller != admin {
            return Err(ContractError::Unauthorized);
        }
        caller.require_auth();
        Ok(())
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{
        testutils::{Address as _, MockAuth, MockAuthInvoke},
        token::{Client as TokenClient, StellarAssetClient},
        Env, IntoVal,
    };

    fn create_token(env: &Env, admin: &Address) -> Address {
        let id = env.register_stellar_asset_contract_v2(admin.clone());
        StellarAssetClient::new(env, &id.address()).mint(admin, &10_000_000_000_000);
        id.address()
    }

    #[test]
    fn test_pay_tuition() {
        let env = Env::default();
        env.mock_all_auths();
        let id       = env.register_contract(None, TuitionContract);
        let client   = TuitionContractClient::new(&env, &id);
        let admin    = Address::generate(&env);
        let treasury = Address::generate(&env);
        let student  = Address::generate(&env);
        let token    = create_token(&env, &admin);

        // Fund student
        StellarAssetClient::new(&env, &token).mint(&student, &5_000_000_000);

        client.initialize(&admin, &token, &treasury);
        client.pay(
            &student,
            &String::from_str(&env, "2024/2025"),
            &1,
            &100,
        );
        assert!(client.is_paid(
            &student,
            &String::from_str(&env, "2024/2025"),
            &1,
        ));
    }
}
