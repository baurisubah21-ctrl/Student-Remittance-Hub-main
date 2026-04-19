# Remittance Escrow — Soroban Smart Contract

A Stellar Soroban smart contract that powers the EduPay remittance escrow system. Students deposit USDC into the contract, and funds are released to the university only after confirmation of receipt.

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup)

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add the WASM target
rustup target add wasm32-unknown-unknown

# Install Soroban CLI
cargo install --locked soroban-cli
```

## Build

```bash
cd smart-contract
soroban contract build
```

The compiled WASM will be at:
```
target/wasm32-unknown-unknown/release/remittance_contract.wasm
```

## Test

```bash
cargo test
```

## Deploy to Testnet

```bash
# 1. Configure testnet identity
soroban keys generate --global deployer --network testnet

# 2. Deploy the contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/remittance_contract.wasm \
  --source deployer \
  --network testnet

# Save the returned CONTRACT_ID

# 3. Initialize the contract
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source deployer \
  --network testnet \
  -- \
  initialize \
  --admin <ADMIN_ADDRESS> \
  --token <USDC_TOKEN_ADDRESS> \
  --fee_bps 50 \
  --fee_recv <FEE_RECEIVER_ADDRESS>
```

## Contract Functions

| Function | Caller | Description |
|---|---|---|
| `initialize` | Admin (once) | Set admin, USDC token, fee %, fee receiver |
| `create_remittance` | Student | Deposit USDC into escrow for a university |
| `confirm_receipt` | University / Admin | Release escrowed funds to university |
| `refund` | Admin | Refund full amount back to student |
| `get_remittance` | Anyone | Query remittance by ID |
| `get_count` | Anyone | Total remittances created |
| `set_fee_bps` | Admin | Update platform fee (basis points) |

## Architecture

```
Student ──► create_remittance() ──► USDC held in contract
                                         │
                    ┌────────────────────┤
                    ▼                    ▼
          confirm_receipt()         refund()
            (university)             (admin)
                    │                    │
                    ▼                    ▼
          USDC → University      USDC → Student
          Fee  → Platform
```
