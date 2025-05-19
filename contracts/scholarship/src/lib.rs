#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    token, Address, Env, String,
};

#[contracttype]
#[derive(Clone)]
pub enum ScholarshipStatus {
    Active,
    Awarded,
    Expired,
    Revoked,
}

#[contracttype]
#[derive(Clone)]
pub struct Scholarship {
    pub id:            u32,
    pub name:          String,
    pub description:   String,
    pub amount:        i128,
    pub token:         Address,
    pub min_gpa_x100:  u32,
    pub max_awards:    u32,
    pub awarded_count: u32,
    pub status:        ScholarshipStatus,
    pub created_at:    u64,
}

#[contracttype]
#[derive(Clone)]
pub struct Award {
    pub scholarship_id: u32,
    pub student:        Address,
    pub amount:         i128,
    pub awarded_at:     u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Token,
    NextId,
    Scholarship(u32),
    Award(u32, Address),
}

#[contracttype]
pub enum ContractError {
    AlreadyInitialized,
    NotInitialized,
    Unauthorized,
    ScholarshipNotFound,
    AlreadyAwarded,
    MaxAwardsReached,
    GpaTooLow,
}

#[contract]
pub struct ScholarshipContract;

#[contractimpl]
impl ScholarshipContract {
    pub fn initialize(env: Env, admin: Address, token: Address) -> Result<(), ContractError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(ContractError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::NextId, &1u32);
        Ok(())
    }

    pub fn create_scholarship(
        env:           Env,
        caller:        Address,
        name:          String,
        description:   String,
        amount:        i128,
        min_gpa_x100:  u32,
        max_awards:    u32,
    ) -> Result<u32, ContractError> {
        Self::require_admin(&env, &caller)?;

        let id: u32 = env.storage().instance().get(&DataKey::NextId).unwrap_or(1);
        let token: Address = env
            .storage()
            .instance()
            .get(&DataKey::Token)
            .ok_or(ContractError::NotInitialized)?;

        let scholarship = Scholarship {
            id,
            name,
            description,
            amount,
            token,
            min_gpa_x100,
            max_awards,
            awarded_count: 0,
            status:        ScholarshipStatus::Active,
            created_at:    env.ledger().timestamp(),
        };
        env.storage().persistent().set(&DataKey::Scholarship(id), &scholarship);
        env.storage().instance().set(&DataKey::NextId, &(id + 1));

        env.events()
            .publish((symbol_short!("scholar"), symbol_short!("create")), id);
        Ok(id)
    }

    pub fn award(
        env:            Env,
        caller:         Address,
        scholarship_id: u32,
        student:        Address,
        student_gpa_x100: u32,
    ) -> Result<(), ContractError> {
        Self::require_admin(&env, &caller)?;

        let mut s: Scholarship = env
            .storage()
            .persistent()
            .get(&DataKey::Scholarship(scholarship_id))
            .ok_or(ContractError::ScholarshipNotFound)?;

        if s.awarded_count >= s.max_awards {
            return Err(ContractError::MaxAwardsReached);
        }
        if student_gpa_x100 < s.min_gpa_x100 {
            return Err(ContractError::GpaTooLow);
        }

        let award_key = DataKey::Award(scholarship_id, student.clone());
        if env.storage().persistent().has(&award_key) {
            return Err(ContractError::AlreadyAwarded);
        }

        let contract_addr = env.current_contract_address();
        let token_client = token::Client::new(&env, &s.token);
        token_client.transfer(&contract_addr, &student, &s.amount);

        s.awarded_count += 1;
        env.storage()
            .persistent()
            .set(&DataKey::Scholarship(scholarship_id), &s);

        let award = Award {
            scholarship_id,
            student:    student.clone(),
            amount:     s.amount,
            awarded_at: env.ledger().timestamp(),
        };
        env.storage().persistent().set(&award_key, &award);

        env.events().publish(
            (symbol_short!("scholar"), symbol_short!("award")),
            (scholarship_id, student, s.amount),
        );
        Ok(())
    }

    pub fn get_scholarship(env: Env, id: u32) -> Result<Scholarship, ContractError> {
        env.storage()
            .persistent()
            .get(&DataKey::Scholarship(id))
            .ok_or(ContractError::ScholarshipNotFound)
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
