#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, log, symbol_short, token, Address, Env,
    String, Symbol,
};

// ─────────────────────────── Data Keys ───────────────────────────

const ADMIN: Symbol = symbol_short!("ADMIN");
const TOKEN: Symbol = symbol_short!("TOKEN");
const FEE_BPS: Symbol = symbol_short!("FEE_BPS");
const FEE_RECV: Symbol = symbol_short!("FEE_RECV");
const REM_COUNT: Symbol = symbol_short!("REM_CNT");

/// Unique per-remittance storage key.
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Remittance(u64),
}

// ─────────────────────────── Domain Types ────────────────────────

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum RemittanceStatus {
    Pending,
    Confirmed,
    Refunded,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Remittance {
    pub id: u64,
    pub student: Address,
    pub university: Address,
    pub amount: i128,
    pub fee: i128,
    pub student_ref: String,
    pub status: RemittanceStatus,
    pub created_at: u64,
}

// ─────────────────────────── Errors ──────────────────────────────

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum RemittanceError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    InvalidAmount = 4,
    NotFound = 5,
    InvalidStatus = 6,
    InsufficientBalance = 7,
    InvalidFeeBps = 8,
}

// ─────────────────────────── Contract ────────────────────────────

#[contract]
pub struct RemittanceContract;

#[contractimpl]
impl RemittanceContract {
    // ──────────── Admin: Initialize ────────────

    /// Initializes the contract. Must be called once before any remittance
    /// operations. Sets the admin, accepted USDC token address, fee basis
    /// points (1 bp = 0.01 %), and the fee receiver address.
    ///
    /// # Arguments
    /// * `admin`     – Platform administrator address
    /// * `token`     – Stellar asset contract address for USDC
    /// * `fee_bps`   – Platform fee in basis points (e.g. 50 = 0.5 %)
    /// * `fee_recv`  – Address that collects platform fees
    pub fn initialize(
        env: Env,
        admin: Address,
        token: Address,
        fee_bps: u32,
        fee_recv: Address,
    ) -> Result<(), RemittanceError> {
        if env.storage().instance().has(&ADMIN) {
            return Err(RemittanceError::AlreadyInitialized);
        }
        if fee_bps > 10_000 {
            return Err(RemittanceError::InvalidFeeBps);
        }

        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&TOKEN, &token);
        env.storage().instance().set(&FEE_BPS, &fee_bps);
        env.storage().instance().set(&FEE_RECV, &fee_recv);
        env.storage().instance().set(&REM_COUNT, &0u64);

        log!(&env, "Contract initialized by admin");
        Ok(())
    }

    // ──────────── Student: Create Remittance ────────────

    /// Creates a new remittance escrow. The student's USDC is transferred into
    /// the contract and held until the university confirms receipt.
    ///
    /// # Arguments
    /// * `student`     – The paying student (must authorize)
    /// * `university`  – The receiving university's Stellar address
    /// * `amount`      – USDC amount in stroops (7-decimal)
    /// * `student_ref` – Off-chain student ID reference (e.g. "STU-2026-890")
    ///
    /// # Returns
    /// The newly created `Remittance` struct (includes computed fee and id).
    pub fn create_remittance(
        env: Env,
        student: Address,
        university: Address,
        amount: i128,
        student_ref: String,
    ) -> Result<Remittance, RemittanceError> {
        // Require authorization from student
        student.require_auth();

        if amount <= 0 {
            return Err(RemittanceError::InvalidAmount);
        }

        let token_address: Address = env
            .storage()
            .instance()
            .get(&TOKEN)
            .ok_or(RemittanceError::NotInitialized)?;
        let fee_bps: u32 = env
            .storage()
            .instance()
            .get(&FEE_BPS)
            .ok_or(RemittanceError::NotInitialized)?;

        // Calculate platform fee
        let fee = (amount * fee_bps as i128) / 10_000;
        let total = amount + fee;

        // Transfer total (amount + fee) from student to this contract
        let contract_address = env.current_contract_address();
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&student, &contract_address, &total);

        // Increment remittance counter
        let mut count: u64 = env.storage().instance().get(&REM_COUNT).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&REM_COUNT, &count);

        // Build remittance record
        let remittance = Remittance {
            id: count,
            student: student.clone(),
            university: university.clone(),
            amount,
            fee,
            student_ref,
            status: RemittanceStatus::Pending,
            created_at: env.ledger().timestamp(),
        };

        // Persist
        env.storage()
            .persistent()
            .set(&DataKey::Remittance(count), &remittance);

        log!(
            &env,
            "Remittance #{} created: {} -> {} for {} stroops",
            count,
            student,
            university,
            amount
        );

        env.events().publish(
            (symbol_short!("created"), student),
            (count, amount),
        );

        Ok(remittance)
    }

    // ──────────── University: Confirm Receipt ────────────

    /// Called by the university (or admin) to confirm that the real-world
    /// tuition payment was received. Releases escrowed funds to the university
    /// and sends the platform fee to the fee receiver.
    ///
    /// # Arguments
    /// * `caller`        – Must be the university or the admin
    /// * `remittance_id` – ID of the remittance to confirm
    pub fn confirm_receipt(
        env: Env,
        caller: Address,
        remittance_id: u64,
    ) -> Result<Remittance, RemittanceError> {
        caller.require_auth();

        let mut remittance: Remittance = env
            .storage()
            .persistent()
            .get(&DataKey::Remittance(remittance_id))
            .ok_or(RemittanceError::NotFound)?;

        if remittance.status != RemittanceStatus::Pending {
            return Err(RemittanceError::InvalidStatus);
        }

        // Only the designated university or admin may confirm
        let admin: Address = env
            .storage()
            .instance()
            .get(&ADMIN)
            .ok_or(RemittanceError::NotInitialized)?;
        if caller != remittance.university && caller != admin {
            return Err(RemittanceError::Unauthorized);
        }

        let token_address: Address = env
            .storage()
            .instance()
            .get(&TOKEN)
            .ok_or(RemittanceError::NotInitialized)?;
        let fee_recv: Address = env
            .storage()
            .instance()
            .get(&FEE_RECV)
            .ok_or(RemittanceError::NotInitialized)?;

        let contract_address = env.current_contract_address();
        let token_client = token::Client::new(&env, &token_address);

        // Release principal to university
        token_client.transfer(&contract_address, &remittance.university, &remittance.amount);

        // Send fee to platform
        if remittance.fee > 0 {
            token_client.transfer(&contract_address, &fee_recv, &remittance.fee);
        }

        remittance.status = RemittanceStatus::Confirmed;
        env.storage()
            .persistent()
            .set(&DataKey::Remittance(remittance_id), &remittance);

        log!(&env, "Remittance #{} confirmed", remittance_id);

        env.events().publish(
            (symbol_short!("confirm"), remittance.university.clone()),
            (remittance_id, remittance.amount),
        );

        Ok(remittance)
    }

    // ──────────── Admin: Refund ────────────

    /// Admin-only. Refunds the full escrowed amount (principal + fee) back to
    /// the student. Used for timed-out or disputed remittances.
    ///
    /// # Arguments
    /// * `admin`         – Must be the contract admin
    /// * `remittance_id` – ID of the remittance to refund
    pub fn refund(
        env: Env,
        admin: Address,
        remittance_id: u64,
    ) -> Result<Remittance, RemittanceError> {
        admin.require_auth();

        let stored_admin: Address = env
            .storage()
            .instance()
            .get(&ADMIN)
            .ok_or(RemittanceError::NotInitialized)?;
        if admin != stored_admin {
            return Err(RemittanceError::Unauthorized);
        }

        let mut remittance: Remittance = env
            .storage()
            .persistent()
            .get(&DataKey::Remittance(remittance_id))
            .ok_or(RemittanceError::NotFound)?;

        if remittance.status != RemittanceStatus::Pending {
            return Err(RemittanceError::InvalidStatus);
        }

        let token_address: Address = env
            .storage()
            .instance()
            .get(&TOKEN)
            .ok_or(RemittanceError::NotInitialized)?;

        let contract_address = env.current_contract_address();
        let token_client = token::Client::new(&env, &token_address);

        // Refund principal + fee back to student
        let total = remittance.amount + remittance.fee;
        token_client.transfer(&contract_address, &remittance.student, &total);

        remittance.status = RemittanceStatus::Refunded;
        env.storage()
            .persistent()
            .set(&DataKey::Remittance(remittance_id), &remittance);

        log!(&env, "Remittance #{} refunded to student", remittance_id);

        env.events().publish(
            (symbol_short!("refund"), remittance.student.clone()),
            (remittance_id, total),
        );

        Ok(remittance)
    }

    // ──────────── Read-Only: Query ────────────

    /// Returns remittance details by ID. Returns `None` if not found.
    pub fn get_remittance(env: Env, remittance_id: u64) -> Result<Remittance, RemittanceError> {
        env.storage()
            .persistent()
            .get(&DataKey::Remittance(remittance_id))
            .ok_or(RemittanceError::NotFound)
    }

    /// Returns the total number of remittances created.
    pub fn get_count(env: Env) -> u64 {
        env.storage().instance().get(&REM_COUNT).unwrap_or(0)
    }

    // ──────────── Admin: Update Fee ────────────

    /// Admin-only. Updates the platform fee in basis points.
    pub fn set_fee_bps(env: Env, admin: Address, new_fee_bps: u32) -> Result<(), RemittanceError> {
        admin.require_auth();

        let stored_admin: Address = env
            .storage()
            .instance()
            .get(&ADMIN)
            .ok_or(RemittanceError::NotInitialized)?;
        if admin != stored_admin {
            return Err(RemittanceError::Unauthorized);
        }
        if new_fee_bps > 10_000 {
            return Err(RemittanceError::InvalidFeeBps);
        }

        env.storage().instance().set(&FEE_BPS, &new_fee_bps);
        log!(&env, "Fee updated to {} bps", new_fee_bps);
        Ok(())
    }
}

// ─────────────────────────── Tests ───────────────────────────────

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Ledger};
    use soroban_sdk::{token::StellarAssetClient, Env};

    fn setup_env() -> (
        Env,
        Address,         // contract
        Address,         // admin
        Address,         // token
        Address,         // fee_recv
        Address,         // student
        Address,         // university
    ) {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(RemittanceContract, ());
        let admin = Address::generate(&env);
        let fee_recv = Address::generate(&env);
        let student = Address::generate(&env);
        let university = Address::generate(&env);

        // Create a test token (USDC mock)
        let token_admin = Address::generate(&env);
        let token_address = env.register_stellar_asset_contract_v2(token_admin.clone()).address();

        // Mint tokens to the student
        let sac = StellarAssetClient::new(&env, &token_address);
        sac.mint(&student, &1_000_000_0000000); // 1M USDC (7 decimals)

        (env, contract_id, admin, token_address, fee_recv, student, university)
    }

    #[test]
    fn test_full_flow() {
        let (env, contract_id, admin, token, fee_recv, student, university) = setup_env();
        let client = RemittanceContractClient::new(&env, &contract_id);

        // 1. Initialize
        client.initialize(&admin, &token, &50_u32, &fee_recv); // 0.5% fee

        // 2. Create remittance
        let student_ref = String::from_str(&env, "STU-2026-890");
        let remittance = client.create_remittance(
            &student,
            &university,
            &100_0000000, // 100 USDC
            &student_ref,
        );

        assert_eq!(remittance.id, 1);
        assert_eq!(remittance.amount, 100_0000000);
        assert_eq!(remittance.fee, 500000); // 0.5% of 100 USDC
        assert_eq!(remittance.status, RemittanceStatus::Pending);

        // 3. Confirm receipt
        let confirmed = client.confirm_receipt(&university, &1);
        assert_eq!(confirmed.status, RemittanceStatus::Confirmed);

        // 4. Verify count
        assert_eq!(client.get_count(), 1);
    }

    #[test]
    fn test_refund_flow() {
        let (env, contract_id, admin, token, fee_recv, student, university) = setup_env();
        let client = RemittanceContractClient::new(&env, &contract_id);

        client.initialize(&admin, &token, &100_u32, &fee_recv); // 1% fee

        let student_ref = String::from_str(&env, "STU-2026-999");
        client.create_remittance(&student, &university, &500_0000000, &student_ref);

        // Refund
        let refunded = client.refund(&admin, &1);
        assert_eq!(refunded.status, RemittanceStatus::Refunded);
    }

    #[test]
    #[should_panic]
    fn test_double_initialize() {
        let (env, contract_id, admin, token, fee_recv, _student, _university) = setup_env();
        let client = RemittanceContractClient::new(&env, &contract_id);

        client.initialize(&admin, &token, &50_u32, &fee_recv);
        client.initialize(&admin, &token, &50_u32, &fee_recv); // Should panic
    }
}
