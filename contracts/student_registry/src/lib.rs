#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, String, Vec,
};

#[contracttype]
#[derive(Clone)]
pub enum StudentStatus {
    Active,
    Suspended,
    Graduated,
    Withdrawn,
    Deferred,
}

#[contracttype]
#[derive(Clone)]
pub struct StudentRecord {
    pub public_key:  Address,
    pub matric:      String,
    pub first_name:  String,
    pub last_name:   String,
    pub department:  String,
    pub level:       u32,
    pub status:      StudentStatus,
    pub enrolled_at: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Student(Address),
    MatricIndex(String),
    StudentCount,
}

#[contracttype]
pub enum ContractError {
    AlreadyInitialized,
    NotInitialized,
    Unauthorized,
    StudentNotFound,
    AlreadyRegistered,
    InvalidInput,
}

#[contract]
pub struct StudentRegistryContract;

#[contractimpl]
impl StudentRegistryContract {
    pub fn initialize(env: Env, admin: Address) -> Result<(), ContractError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(ContractError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::StudentCount, &0u32);
        env.events()
            .publish((symbol_short!("registry"), symbol_short!("init")), admin);
        Ok(())
    }

    pub fn register(
        env:         Env,
        caller:      Address,
        matric:      String,
        first_name:  String,
        last_name:   String,
        department:  String,
        level:       u32,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &caller)?;

        if env.storage().persistent().has(&DataKey::MatricIndex(matric.clone())) {
            return Err(ContractError::AlreadyRegistered);
        }
        if level == 0 || level > 700 {
            return Err(ContractError::InvalidInput);
        }

        let record = StudentRecord {
            public_key:  caller.clone(),
            matric:      matric.clone(),
            first_name,
            last_name,
            department,
            level,
            status:      StudentStatus::Active,
            enrolled_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&DataKey::Student(caller.clone()), &record);
        env.storage().persistent().set(&DataKey::MatricIndex(matric.clone()), &caller);

        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::StudentCount)
            .unwrap_or(0);
        env.storage().instance().set(&DataKey::StudentCount, &(count + 1));

        env.events()
            .publish((symbol_short!("student"), symbol_short!("register")), (caller, matric));
        Ok(())
    }

    pub fn get_student(env: Env, student: Address) -> Result<StudentRecord, ContractError> {
        env.storage()
            .persistent()
            .get(&DataKey::Student(student))
            .ok_or(ContractError::StudentNotFound)
    }

    pub fn update_status(
        env:     Env,
        caller:  Address,
        student: Address,
        status:  StudentStatus,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &caller)?;
        let mut record: StudentRecord = env
            .storage()
            .persistent()
            .get(&DataKey::Student(student.clone()))
            .ok_or(ContractError::StudentNotFound)?;
        record.status = status;
        env.storage().persistent().set(&DataKey::Student(student.clone()), &record);
        env.events()
            .publish((symbol_short!("student"), symbol_short!("status")), student);
        Ok(())
    }

    pub fn update_level(
        env:     Env,
        caller:  Address,
        student: Address,
        level:   u32,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &caller)?;
        if level == 0 || level > 700 {
            return Err(ContractError::InvalidInput);
        }
        let mut record: StudentRecord = env
            .storage()
            .persistent()
            .get(&DataKey::Student(student.clone()))
            .ok_or(ContractError::StudentNotFound)?;
        record.level = level;
        env.storage().persistent().set(&DataKey::Student(student.clone()), &record);
        Ok(())
    }

    pub fn count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::StudentCount)
            .unwrap_or(0)
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

    fn setup() -> (Env, Address, Address) {
        let env       = Env::default();
        env.mock_all_auths();
        let id        = env.register_contract(None, StudentRegistryContract);
        let client    = StudentRegistryContractClient::new(&env, &id);
        let admin     = Address::generate(&env);
        client.initialize(&admin);
        (env, id, admin)
    }

    #[test]
    fn test_register_and_get() {
        let (env, id, admin) = setup();
        let client  = StudentRegistryContractClient::new(&env, &id);
        let student = Address::generate(&env);

        client.register(
            &student,
            &String::from_str(&env, "SU/2025/001"),
            &String::from_str(&env, "Ada"),
            &String::from_str(&env, "Okafor"),
            &String::from_str(&env, "CSC"),
            &100,
        );

        let rec = client.get_student(&student);
        assert_eq!(rec.level, 100);
        assert_eq!(client.count(), 1);
    }

    #[test]
    fn test_duplicate_matric_rejected() {
        let (env, id, admin) = setup();
        let client   = StudentRegistryContractClient::new(&env, &id);
        let s1       = Address::generate(&env);
        let s2       = Address::generate(&env);
        let matric   = String::from_str(&env, "SU/2025/001");

        client.register(&s1, &matric,
            &String::from_str(&env, "A"), &String::from_str(&env, "B"),
            &String::from_str(&env, "CSC"), &100);

        let res = client.try_register(&s2, &matric,
            &String::from_str(&env, "C"), &String::from_str(&env, "D"),
            &String::from_str(&env, "PHY"), &100);
        assert!(res.is_err());
    }

    #[test]
    fn test_update_level() {
        let (env, id, admin) = setup();
        let client  = StudentRegistryContractClient::new(&env, &id);
        let student = Address::generate(&env);

        client.register(
            &student,
            &String::from_str(&env, "SU/2025/002"),
            &String::from_str(&env, "Emeka"),
            &String::from_str(&env, "Nwosu"),
            &String::from_str(&env, "PHY"),
            &100,
        );
        client.update_level(&admin, &student, &200);
        let rec = client.get_student(&student);
        assert_eq!(rec.level, 200);
    }

    #[test]
    fn test_unauthorized_register_rejected() {
        let (env, id, _admin) = setup();
        let client    = StudentRegistryContractClient::new(&env, &id);
        let non_admin = Address::generate(&env);

        let res = client.try_register(
            &non_admin,
            &String::from_str(&env, "SU/2025/003"),
            &String::from_str(&env, "Chioma"),
            &String::from_str(&env, "Ike"),
            &String::from_str(&env, "CHM"),
            &100,
        );
        assert!(res.is_err());
    }
}
