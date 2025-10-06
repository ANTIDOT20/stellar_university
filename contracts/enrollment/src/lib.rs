#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, String,
};

#[contracttype]
#[derive(Clone)]
pub enum EnrollmentStatus {
    Registered,
    Graded,
    Withdrawn,
    Incomplete,
}

#[contracttype]
#[derive(Clone)]
pub struct EnrollmentRecord {
    pub student:     Address,
    pub course:      String,
    pub session:     String,
    pub semester:    u32,
    pub status:      EnrollmentStatus,
    pub enrolled_at: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    TuitionContract,
    Enrollment(Address, String, String, u32),
    EnrollmentCount,
}

#[contracttype]
pub enum ContractError {
    AlreadyInitialized,
    NotInitialized,
    Unauthorized,
    AlreadyEnrolled,
    EnrollmentNotFound,
    TuitionNotPaid,
}

#[contract]
pub struct EnrollmentContract;

#[contractimpl]
impl EnrollmentContract {
    pub fn initialize(
        env:              Env,
        admin:            Address,
        tuition_contract: Address,
    ) -> Result<(), ContractError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(ContractError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TuitionContract, &tuition_contract);
        env.storage().instance().set(&DataKey::EnrollmentCount, &0u32);
        Ok(())
    }

    pub fn enroll(
        env:      Env,
        student:  Address,
        course:   String,
        session:  String,
        semester: u32,
    ) -> Result<(), ContractError> {
        student.require_auth();

        let key = DataKey::Enrollment(
            student.clone(),
            course.clone(),
            session.clone(),
            semester,
        );
        if env.storage().persistent().has(&key) {
            return Err(ContractError::AlreadyEnrolled);
        }

        let record = EnrollmentRecord {
            student:     student.clone(),
            course:      course.clone(),
            session:     session.clone(),
            semester,
            status:      EnrollmentStatus::Registered,
            enrolled_at: env.ledger().timestamp(),
        };
        env.storage().persistent().set(&key, &record);

        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::EnrollmentCount)
            .unwrap_or(0);
        env.storage().instance().set(&DataKey::EnrollmentCount, &(count + 1));

        env.events().publish(
            (symbol_short!("enroll"), symbol_short!("reg")),
            (student, course, session, semester),
        );
        Ok(())
    }

    pub fn withdraw(
        env:      Env,
        student:  Address,
        course:   String,
        session:  String,
        semester: u32,
    ) -> Result<(), ContractError> {
        student.require_auth();
        let key = DataKey::Enrollment(
            student.clone(),
            course.clone(),
            session.clone(),
            semester,
        );
        let mut record: EnrollmentRecord = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(ContractError::EnrollmentNotFound)?;
        record.status = EnrollmentStatus::Withdrawn;
        env.storage().persistent().set(&key, &record);
        env.events().publish(
            (symbol_short!("enroll"), symbol_short!("drop")),
            (student, course),
        );
        Ok(())
    }

    pub fn mark_graded(
        env:      Env,
        caller:   Address,
        student:  Address,
        course:   String,
        session:  String,
        semester: u32,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &caller)?;
        let key = DataKey::Enrollment(
            student.clone(),
            course.clone(),
            session.clone(),
            semester,
        );
        let mut record: EnrollmentRecord = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(ContractError::EnrollmentNotFound)?;
        record.status = EnrollmentStatus::Graded;
        env.storage().persistent().set(&key, &record);
        Ok(())
    }

    pub fn get_enrollment(
        env:      Env,
        student:  Address,
        course:   String,
        session:  String,
        semester: u32,
    ) -> Result<EnrollmentRecord, ContractError> {
        env.storage()
            .persistent()
            .get(&DataKey::Enrollment(student, course, session, semester))
            .ok_or(ContractError::EnrollmentNotFound)
    }

    pub fn count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::EnrollmentCount).unwrap_or(0)
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

    fn setup() -> (Env, Address, Address, Address) {
        let env     = Env::default();
        env.mock_all_auths();
        let id      = env.register_contract(None, EnrollmentContract);
        let admin   = Address::generate(&env);
        let tuition = Address::generate(&env);
        let client  = EnrollmentContractClient::new(&env, &id);
        client.initialize(&admin, &tuition);
        (env, id, admin, tuition)
    }

    #[test]
    fn test_enroll_and_count() {
        let (env, id, _, _) = setup();
        let client  = EnrollmentContractClient::new(&env, &id);
        let student = Address::generate(&env);
        let course  = String::from_str(&env, "SBC301");
        let session = String::from_str(&env, "2024/2025");

        client.enroll(&student, &course, &session, &1);
        assert_eq!(client.count(), 1);
    }

    #[test]
    fn test_withdraw_sets_status() {
        let (env, id, _, _) = setup();
        let client  = EnrollmentContractClient::new(&env, &id);
        let student = Address::generate(&env);
        let course  = String::from_str(&env, "CSC301");
        let session = String::from_str(&env, "2024/2025");

        client.enroll(&student, &course, &session, &1);
        client.withdraw(&student, &course, &session, &1);
        let rec = client.get_enrollment(&student, &course, &session, &1);
        assert!(matches!(rec.status, EnrollmentStatus::Withdrawn));
    }

    #[test]
    fn test_double_enroll_rejected() {
        let (env, id, _, _) = setup();
        let client  = EnrollmentContractClient::new(&env, &id);
        let student = Address::generate(&env);
        let course  = String::from_str(&env, "MTH101");
        let session = String::from_str(&env, "2024/2025");

        client.enroll(&student, &course, &session, &1);
        let res = client.try_enroll(&student, &course, &session, &1);
        assert!(res.is_err());
    }
}
