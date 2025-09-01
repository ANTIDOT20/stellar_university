#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, String,
};

#[contracttype]
#[derive(Clone)]
pub struct GradeRecord {
    pub student:      Address,
    pub course:       String,
    pub session:      String,
    pub semester:     u32,
    pub score:        u32,
    pub grade:        String,
    pub grade_points: u32,
    pub credit_units: u32,
    pub graded_by:    Address,
    pub graded_at:    u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    EnrollmentContract,
    Grade(Address, String, String, u32),
    GradeCount,
}

#[contracttype]
pub enum ContractError {
    AlreadyInitialized,
    NotInitialized,
    Unauthorized,
    GradeNotFound,
    AlreadyGraded,
    InvalidScore,
}

fn score_to_grade(score: u32) -> (&'static str, u32) {
    match score {
        70..=100 => ("A", 5),
        60..=69  => ("B", 4),
        50..=59  => ("C", 3),
        45..=49  => ("D", 2),
        40..=44  => ("E", 1),
        _        => ("F", 0),
    }
}

#[contract]
pub struct GradingContract;

#[contractimpl]
impl GradingContract {
    pub fn initialize(
        env:                 Env,
        admin:               Address,
        enrollment_contract: Address,
    ) -> Result<(), ContractError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(ContractError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::EnrollmentContract, &enrollment_contract);
        env.storage().instance().set(&DataKey::GradeCount, &0u32);
        Ok(())
    }

    pub fn submit_grade(
        env:          Env,
        lecturer:     Address,
        student:      Address,
        course:       String,
        session:      String,
        semester:     u32,
        score:        u32,
        credit_units: u32,
    ) -> Result<(), ContractError> {
        lecturer.require_auth();
        if score > 100 {
            return Err(ContractError::InvalidScore);
        }
        if credit_units == 0 || credit_units > 8 {
            return Err(ContractError::InvalidScore);
        }

        let key = DataKey::Grade(
            student.clone(),
            course.clone(),
            session.clone(),
            semester,
        );
        if env.storage().persistent().has(&key) {
            return Err(ContractError::AlreadyGraded);
        }

        let (grade_str, grade_points) = score_to_grade(score);
        let record = GradeRecord {
            student:      student.clone(),
            course:       course.clone(),
            session:      session.clone(),
            semester,
            score,
            grade:        String::from_str(&env, grade_str),
            grade_points,
            credit_units,
            graded_by:    lecturer.clone(),
            graded_at:    env.ledger().timestamp(),
        };
        env.storage().persistent().set(&key, &record);

        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::GradeCount)
            .unwrap_or(0);
        env.storage().instance().set(&DataKey::GradeCount, &(count + 1));

        env.events().publish(
            (symbol_short!("grade"), symbol_short!("submit")),
            (student, course, score),
        );
        Ok(())
    }

    pub fn get_grade(
        env:      Env,
        student:  Address,
        course:   String,
        session:  String,
        semester: u32,
    ) -> Result<GradeRecord, ContractError> {
        env.storage()
            .persistent()
            .get(&DataKey::Grade(student, course, session, semester))
            .ok_or(ContractError::GradeNotFound)
    }

    pub fn count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::GradeCount).unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    fn setup() -> (Env, Address, Address, Address) {
        let env        = Env::default();
        env.mock_all_auths();
        let id         = env.register_contract(None, GradingContract);
        let admin      = Address::generate(&env);
        let enrollment = Address::generate(&env);
        let client     = GradingContractClient::new(&env, &id);
        client.initialize(&admin, &enrollment);
        (env, id, admin, enrollment)
    }

    #[test]
    fn test_submit_grade_a() {
        let (env, id, _, _) = setup();
        let client   = GradingContractClient::new(&env, &id);
        let lecturer = Address::generate(&env);
        let student  = Address::generate(&env);

        client.submit_grade(
            &lecturer,
            &student,
            &String::from_str(&env, "CSC301"),
            &String::from_str(&env, "2024/2025"),
            &1, &75, &3,
        );

        let g = client.get_grade(
            &student,
            &String::from_str(&env, "CSC301"),
            &String::from_str(&env, "2024/2025"),
            &1,
        );
        assert_eq!(g.grade_points, 5);
        assert_eq!(client.count(), 1);
    }

    #[test]
    fn test_boundary_grades() {
        let (env, id, _, _) = setup();
        let client   = GradingContractClient::new(&env, &id);
        let lect     = Address::generate(&env);

        let cases: &[(u32, u32)] = &[
            (100, 5), (70, 5), (69, 4), (60, 4), (59, 3),
            (50, 3),  (49, 2), (45, 2), (44, 1), (40, 1),
            (39, 0),  (0, 0),
        ];

        for (score, expected_pts) in cases {
            let student = Address::generate(&env);
            client.submit_grade(
                &lect, &student,
                &String::from_str(&env, "TST001"),
                &String::from_str(&env, "2024/2025"),
                &1, score, &3,
            );
            let g = client.get_grade(
                &student,
                &String::from_str(&env, "TST001"),
                &String::from_str(&env, "2024/2025"),
                &1,
            );
            assert_eq!(g.grade_points, *expected_pts, "score={score}");
        }
    }

    #[test]
    fn test_duplicate_grade_rejected() {
        let (env, id, _, _) = setup();
        let client  = GradingContractClient::new(&env, &id);
        let lect    = Address::generate(&env);
        let student = Address::generate(&env);

        client.submit_grade(
            &lect, &student,
            &String::from_str(&env, "CSC301"),
            &String::from_str(&env, "2024/2025"),
            &1, &65, &3,
        );
        let res = client.try_submit_grade(
            &lect, &student,
            &String::from_str(&env, "CSC301"),
            &String::from_str(&env, "2024/2025"),
            &1, &70, &3,
        );
        assert!(res.is_err());
    }
}
