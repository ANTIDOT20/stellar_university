#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, String,
};

#[contracttype]
#[derive(Clone)]
pub struct CourseRecord {
    pub code:         String,
    pub title:        String,
    pub department:   String,
    pub credit_units: u32,
    pub level:        u32,
    pub semester:     u32,
    pub lecturer:     Option<Address>,
    pub active:       bool,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Course(String),
    CourseCount,
}

#[contracttype]
pub enum ContractError {
    AlreadyInitialized,
    NotInitialized,
    Unauthorized,
    CourseNotFound,
    AlreadyExists,
    InvalidInput,
}

#[contract]
pub struct CourseRegistryContract;

#[contractimpl]
impl CourseRegistryContract {
    pub fn initialize(env: Env, admin: Address) -> Result<(), ContractError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(ContractError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::CourseCount, &0u32);
        Ok(())
    }

    pub fn add_course(
        env:          Env,
        caller:       Address,
        code:         String,
        title:        String,
        department:   String,
        credit_units: u32,
        level:        u32,
        semester:     u32,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &caller)?;
        if env.storage().persistent().has(&DataKey::Course(code.clone())) {
            return Err(ContractError::AlreadyExists);
        }
        if credit_units == 0 || credit_units > 8 {
            return Err(ContractError::InvalidInput);
        }

        let record = CourseRecord {
            code: code.clone(),
            title,
            department,
            credit_units,
            level,
            semester,
            lecturer: None,
            active:   true,
        };
        env.storage().persistent().set(&DataKey::Course(code.clone()), &record);

        let count: u32 = env.storage().instance().get(&DataKey::CourseCount).unwrap_or(0);
        env.storage().instance().set(&DataKey::CourseCount, &(count + 1));

        env.events()
            .publish((symbol_short!("course"), symbol_short!("add")), code);
        Ok(())
    }

    pub fn assign_lecturer(
        env:      Env,
        caller:   Address,
        code:     String,
        lecturer: Address,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &caller)?;
        let mut record: CourseRecord = env
            .storage()
            .persistent()
            .get(&DataKey::Course(code.clone()))
            .ok_or(ContractError::CourseNotFound)?;
        record.lecturer = Some(lecturer);
        env.storage().persistent().set(&DataKey::Course(code.clone()), &record);
        Ok(())
    }

    pub fn deactivate(
        env:    Env,
        caller: Address,
        code:   String,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &caller)?;
        let mut record: CourseRecord = env
            .storage()
            .persistent()
            .get(&DataKey::Course(code.clone()))
            .ok_or(ContractError::CourseNotFound)?;
        record.active = false;
        env.storage().persistent().set(&DataKey::Course(code.clone()), &record);
        Ok(())
    }

    pub fn get_course(env: Env, code: String) -> Result<CourseRecord, ContractError> {
        env.storage()
            .persistent()
            .get(&DataKey::Course(code))
            .ok_or(ContractError::CourseNotFound)
    }

    pub fn count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::CourseCount).unwrap_or(0)
    }

    /// Extend the TTL of a course record to prevent ledger archival.
    pub fn bump_expiry(env: Env, code: String) -> Result<(), ContractError> {
        let key = DataKey::Course(code);
        if !env.storage().persistent().has(&key) {
            return Err(ContractError::CourseNotFound);
        }
        env.storage().persistent().extend_ttl(&key, 6_307_200, 6_307_200);
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

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_add_and_get_course() {
        let env = Env::default();
        env.mock_all_auths();
        let id     = env.register_contract(None, CourseRegistryContract);
        let client = CourseRegistryContractClient::new(&env, &id);
        let admin  = Address::generate(&env);

        client.initialize(&admin);
        client.add_course(
            &admin,
            &String::from_str(&env, "CSC301"),
            &String::from_str(&env, "Data Structures"),
            &String::from_str(&env, "CSC"),
            &3,
            &300,
            &1,
        );

        let c = client.get_course(&String::from_str(&env, "CSC301"));
        assert_eq!(c.credit_units, 3);
        assert_eq!(client.count(), 1);
    }
}
