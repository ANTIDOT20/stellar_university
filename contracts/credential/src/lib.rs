#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, String, BytesN,
};

#[contracttype]
#[derive(Clone, PartialEq)]
pub enum CredentialType {
    Degree,
    Diploma,
    Transcript,
    Certificate,
    KycTier1,
    KycTier2,
}

#[contracttype]
#[derive(Clone)]
pub struct CredentialRecord {
    pub holder:          Address,
    pub credential_type: CredentialType,
    pub issuer:          Address,
    pub ipfs_cid:        String,
    pub degree_class:    String,
    pub session:         String,
    pub issued_at:       u64,
    pub revoked:         bool,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Credential(BytesN<32>),
    HolderCount(Address),
}

#[contracttype]
pub enum ContractError {
    AlreadyInitialized,
    NotInitialized,
    Unauthorized,
    CredentialNotFound,
    AlreadyRevoked,
}

#[contract]
pub struct CredentialContract;

#[contractimpl]
impl CredentialContract {
    pub fn initialize(env: Env, admin: Address) -> Result<(), ContractError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(ContractError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        Ok(())
    }

    pub fn issue(
        env:             Env,
        caller:          Address,
        holder:          Address,
        credential_type: CredentialType,
        ipfs_cid:        String,
        degree_class:    String,
        session:         String,
    ) -> Result<BytesN<32>, ContractError> {
        Self::require_admin(&env, &caller)?;

        // Deterministic ID: hash of holder + type + session
        let id: BytesN<32> = env.crypto().sha256(
            &(holder.clone(), session.clone()).into_val(&env)
        ).into();

        let record = CredentialRecord {
            holder:          holder.clone(),
            credential_type,
            issuer:          caller.clone(),
            ipfs_cid:        ipfs_cid.clone(),
            degree_class,
            session:         session.clone(),
            issued_at:       env.ledger().timestamp(),
            revoked:         false,
        };
        env.storage().persistent().set(&DataKey::Credential(id.clone()), &record);

        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::HolderCount(holder.clone()))
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::HolderCount(holder.clone()), &(count + 1));

        env.events().publish(
            (symbol_short!("cred"), symbol_short!("issue")),
            (holder, ipfs_cid, id.clone()),
        );
        Ok(id)
    }

    pub fn verify(env: Env, id: BytesN<32>) -> Result<bool, ContractError> {
        let record: CredentialRecord = env
            .storage()
            .persistent()
            .get(&DataKey::Credential(id))
            .ok_or(ContractError::CredentialNotFound)?;
        Ok(!record.revoked)
    }

    pub fn get(env: Env, id: BytesN<32>) -> Result<CredentialRecord, ContractError> {
        env.storage()
            .persistent()
            .get(&DataKey::Credential(id))
            .ok_or(ContractError::CredentialNotFound)
    }

    pub fn revoke(
        env:    Env,
        caller: Address,
        id:     BytesN<32>,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &caller)?;
        let mut record: CredentialRecord = env
            .storage()
            .persistent()
            .get(&DataKey::Credential(id.clone()))
            .ok_or(ContractError::CredentialNotFound)?;
        if record.revoked {
            return Err(ContractError::AlreadyRevoked);
        }
        record.revoked = true;
        env.storage().persistent().set(&DataKey::Credential(id.clone()), &record);
        env.events()
            .publish((symbol_short!("cred"), symbol_short!("revoke")), id);
        Ok(())
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
