#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, String, Vec,
};

#[contracttype]
#[derive(Clone, PartialEq)]
pub enum ProposalStatus {
    Active,
    Passed,
    Rejected,
    Executed,
    Cancelled,
}

#[contracttype]
#[derive(Clone)]
pub struct Proposal {
    pub id:          u32,
    pub title:       String,
    pub description: String,
    pub proposer:    Address,
    pub votes_for:   u32,
    pub votes_against: u32,
    pub quorum:      u32,
    pub status:      ProposalStatus,
    pub created_at:  u64,
    pub ends_at:     u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Council,
    NextId,
    Proposal(u32),
    Vote(u32, Address),
}

#[contracttype]
pub enum ContractError {
    AlreadyInitialized,
    NotInitialized,
    Unauthorized,
    ProposalNotFound,
    ProposalClosed,
    AlreadyVoted,
    NotCouncilMember,
}

#[contract]
pub struct GovernanceContract;

#[contractimpl]
impl GovernanceContract {
    pub fn initialize(
        env:     Env,
        admin:   Address,
        council: Vec<Address>,
    ) -> Result<(), ContractError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(ContractError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Council, &council);
        env.storage().instance().set(&DataKey::NextId, &1u32);
        Ok(())
    }

    pub fn propose(
        env:         Env,
        proposer:    Address,
        title:       String,
        description: String,
        duration:    u64,
        quorum:      u32,
    ) -> Result<u32, ContractError> {
        Self::require_council(&env, &proposer)?;

        let id: u32 = env.storage().instance().get(&DataKey::NextId).unwrap_or(1);
        let now = env.ledger().timestamp();

        let proposal = Proposal {
            id,
            title,
            description,
            proposer: proposer.clone(),
            votes_for: 0,
            votes_against: 0,
            quorum,
            status:     ProposalStatus::Active,
            created_at: now,
            ends_at:    now + duration,
        };
        env.storage().persistent().set(&DataKey::Proposal(id), &proposal);
        env.storage().instance().set(&DataKey::NextId, &(id + 1));

        env.events()
            .publish((symbol_short!("gov"), symbol_short!("propose")), (id, proposer));
        Ok(id)
    }

    pub fn vote(
        env:         Env,
        voter:       Address,
        proposal_id: u32,
        support:     bool,
    ) -> Result<(), ContractError> {
        Self::require_council(&env, &voter)?;

        let vote_key = DataKey::Vote(proposal_id, voter.clone());
        if env.storage().persistent().has(&vote_key) {
            return Err(ContractError::AlreadyVoted);
        }

        let mut p: Proposal = env
            .storage()
            .persistent()
            .get(&DataKey::Proposal(proposal_id))
            .ok_or(ContractError::ProposalNotFound)?;

        if p.status != ProposalStatus::Active || env.ledger().timestamp() > p.ends_at {
            return Err(ContractError::ProposalClosed);
        }

        if support {
            p.votes_for += 1;
        } else {
            p.votes_against += 1;
        }

        let total = p.votes_for + p.votes_against;
        if total >= p.quorum {
            p.status = if p.votes_for > p.votes_against {
                ProposalStatus::Passed
            } else {
                ProposalStatus::Rejected
            };
        }

        env.storage().persistent().set(&DataKey::Proposal(proposal_id), &p);
        env.storage().persistent().set(&vote_key, &support);

        env.events()
            .publish((symbol_short!("gov"), symbol_short!("vote")), (proposal_id, voter, support));
        Ok(())
    }

    pub fn execute(
        env:    Env,
        caller: Address,
        id:     u32,
    ) -> Result<(), ContractError> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(ContractError::NotInitialized)?;
        if caller != admin {
            return Err(ContractError::Unauthorized);
        }
        caller.require_auth();

        let mut p: Proposal = env
            .storage()
            .persistent()
            .get(&DataKey::Proposal(id))
            .ok_or(ContractError::ProposalNotFound)?;

        if p.status != ProposalStatus::Passed {
            return Err(ContractError::ProposalClosed);
        }

        p.status = ProposalStatus::Executed;
        env.storage().persistent().set(&DataKey::Proposal(id), &p);
        env.events()
            .publish((symbol_short!("gov"), symbol_short!("execute")), id);
        Ok(())
    }

    pub fn cancel(
        env:    Env,
        caller: Address,
        id:     u32,
    ) -> Result<(), ContractError> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(ContractError::NotInitialized)?;
        if caller != admin {
            return Err(ContractError::Unauthorized);
        }
        caller.require_auth();

        let mut p: Proposal = env
            .storage()
            .persistent()
            .get(&DataKey::Proposal(id))
            .ok_or(ContractError::ProposalNotFound)?;

        if p.status == ProposalStatus::Executed {
            return Err(ContractError::ProposalClosed);
        }

        p.status = ProposalStatus::Cancelled;
        env.storage().persistent().set(&DataKey::Proposal(id), &p);
        Ok(())
    }

    pub fn get_proposal(env: Env, id: u32) -> Result<Proposal, ContractError> {
        env.storage()
            .persistent()
            .get(&DataKey::Proposal(id))
            .ok_or(ContractError::ProposalNotFound)
    }

    fn require_council(env: &Env, caller: &Address) -> Result<(), ContractError> {
        caller.require_auth();
        let council: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::Council)
            .ok_or(ContractError::NotInitialized)?;
        if council.contains(caller) {
            Ok(())
        } else {
            let admin: Address = env
                .storage()
                .instance()
                .get(&DataKey::Admin)
                .ok_or(ContractError::NotInitialized)?;
            if caller == &admin {
                Ok(())
            } else {
                Err(ContractError::NotCouncilMember)
            }
        }
    }
}
