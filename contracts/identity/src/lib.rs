#![no_std]

//! DID (Decentralized Identity) primitive for the Stellar ecosystem.
//! Any dApp can resolve a did:stellar:<pubkey> without contacting StellarU.

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Bytes, Env, String, Vec,
};

#[contracttype]
#[derive(Clone)]
pub struct DidDocument {
    pub subject:      Address,
    pub controller:   Address,
    pub service_urls: Vec<String>,
    pub public_keys:  Vec<Bytes>,
    pub active:       bool,
    pub created_at:   u64,
    pub updated_at:   u64,
}

#[contracttype]
#[derive(Clone)]
pub struct VerifiablePresentation {
    pub holder:           Address,
    pub credential_ids:   Vec<Bytes>,
    pub presentation_hash: Bytes,
    pub presented_at:     u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Did(Address),
    TrustedIssuer(Address),
}

#[contracttype]
pub enum ContractError {
    AlreadyInitialized,
    NotInitialized,
    Unauthorized,
    DidNotFound,
    AlreadyRegistered,
    NotTrustedIssuer,
}

#[contract]
pub struct IdentityContract;

#[contractimpl]
impl IdentityContract {
    pub fn initialize(env: Env, admin: Address) -> Result<(), ContractError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(ContractError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.events()
            .publish((symbol_short!("did"), symbol_short!("init")), admin);
        Ok(())
    }

    pub fn register_did(
        env:          Env,
        subject:      Address,
        service_urls: Vec<String>,
    ) -> Result<(), ContractError> {
        subject.require_auth();
        if env.storage().persistent().has(&DataKey::Did(subject.clone())) {
            return Err(ContractError::AlreadyRegistered);
        }

        let doc = DidDocument {
            subject:      subject.clone(),
            controller:   subject.clone(),
            service_urls,
            public_keys:  Vec::new(&env),
            active:       true,
            created_at:   env.ledger().timestamp(),
            updated_at:   env.ledger().timestamp(),
        };
        env.storage().persistent().set(&DataKey::Did(subject.clone()), &doc);

        env.events()
            .publish((symbol_short!("did"), symbol_short!("register")), subject);
        Ok(())
    }

    pub fn update_service_urls(
        env:          Env,
        subject:      Address,
        service_urls: Vec<String>,
    ) -> Result<(), ContractError> {
        subject.require_auth();
        let mut doc: DidDocument = env
            .storage()
            .persistent()
            .get(&DataKey::Did(subject.clone()))
            .ok_or(ContractError::DidNotFound)?;
        doc.service_urls = service_urls;
        doc.updated_at = env.ledger().timestamp();
        env.storage().persistent().set(&DataKey::Did(subject.clone()), &doc);
        Ok(())
    }

    pub fn deactivate(env: Env, subject: Address) -> Result<(), ContractError> {
        subject.require_auth();
        let mut doc: DidDocument = env
            .storage()
            .persistent()
            .get(&DataKey::Did(subject.clone()))
            .ok_or(ContractError::DidNotFound)?;
        doc.active = false;
        doc.updated_at = env.ledger().timestamp();
        env.storage().persistent().set(&DataKey::Did(subject.clone()), &doc);
        Ok(())
    }

    pub fn resolve(env: Env, subject: Address) -> Result<DidDocument, ContractError> {
        env.storage()
            .persistent()
            .get(&DataKey::Did(subject))
            .ok_or(ContractError::DidNotFound)
    }

    pub fn add_trusted_issuer(
        env:    Env,
        caller: Address,
        issuer: Address,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &caller)?;
        env.storage()
            .instance()
            .set(&DataKey::TrustedIssuer(issuer.clone()), &true);
        env.events()
            .publish((symbol_short!("did"), symbol_short!("issuer")), issuer);
        Ok(())
    }

    pub fn is_trusted_issuer(env: Env, issuer: Address) -> bool {
        env.storage()
            .instance()
            .get::<_, bool>(&DataKey::TrustedIssuer(issuer))
            .unwrap_or(false)
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
    use soroban_sdk::{testutils::Address as _, vec, Env};

    #[test]
    fn test_register_and_resolve() {
        let env = Env::default();
        env.mock_all_auths();
        let id      = env.register_contract(None, IdentityContract);
        let client  = IdentityContractClient::new(&env, &id);
        let admin   = Address::generate(&env);
        let subject = Address::generate(&env);

        client.initialize(&admin);
        client.register_did(
            &subject,
            &vec![&env, String::from_str(&env, "https://stellaru.xyz/did/resolve")],
        );

        let doc = client.resolve(&subject);
        assert!(doc.active);
        assert_eq!(doc.subject, subject);
    }
}
