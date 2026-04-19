const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const StellarSdk = require('@stellar/stellar-sdk');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Stellar Configuration ──────────────────────────────────────────
const NETWORK = process.env.STELLAR_NETWORK || 'TESTNET';
const HORIZON_URL =
  NETWORK === 'PUBLIC'
    ? 'https://horizon.stellar.org'
    : 'https://horizon-testnet.stellar.org';

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

// ── Mock Database ──────────────────────────────────────────────────
const transactions = [];
const universities = [
  {
    id: 'stanford',
    name: 'Stanford University',
    wallet: 'GBZH7S5NC67XLQYAKZSP6NV7BFNDISONMQ6BMRMSXDILIATELBBM72XA',
    country: 'US',
  },
  {
    id: 'mit',
    name: 'MIT',
    wallet: 'GCFONE23AB7Y6C5YZOMKUKGETPIAJA752MVG2BNCMM33NSILBV3XAZUI',
    country: 'US',
  },
  {
    id: 'harvard',
    name: 'Harvard University',
    wallet: 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7',
    country: 'US',
  },
];

// ── University Endpoints ───────────────────────────────────────────

app.get('/api/universities', (_req, res) => {
  res.json(universities);
});

// ── Transaction Endpoints ──────────────────────────────────────────

app.get('/api/transactions', (_req, res) => {
  res.json({ success: true, count: transactions.length, data: transactions });
});

app.post('/api/transactions', (req, res) => {
  const { studentId, universityId, amountLocal, targetAmountUSDC, exchangeRate } = req.body;

  if (!studentId || !universityId || !amountLocal) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newTx = {
    id: `tx_${Date.now()}`,
    studentId,
    universityId,
    amountLocal,
    targetAmountUSDC,
    exchangeRate,
    status: 'pending',
    createdAt: new Date(),
  };

  transactions.push(newTx);
  res.status(201).json({ success: true, data: newTx });
});

// ── FX Rates ───────────────────────────────────────────────────────

app.get('/api/fx-rates', (_req, res) => {
  res.json({
    from: 'INR',
    to: 'USDC',
    rate: 0.01197, // 1 INR ≈ 0.01197 USDC (1 USDC ≈ 83.5 INR)
  });
});

// ── Stellar: Account Info ──────────────────────────────────────────

app.get('/api/stellar/account/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const account = await server.loadAccount(address);

    const balances = account.balances.map((b) => ({
      asset: b.asset_type === 'native' ? 'XLM' : `${b.asset_code}:${b.asset_issuer}`,
      balance: b.balance,
    }));

    res.json({
      success: true,
      data: {
        address: account.accountId(),
        sequence: account.sequenceNumber(),
        balances,
      },
    });
  } catch (err) {
    const status = err?.response?.status === 404 ? 404 : 500;
    res.status(status).json({
      success: false,
      error: status === 404 ? 'Account not found on Stellar network' : err.message,
    });
  }
});

// ── Stellar: Submit Transaction ────────────────────────────────────

app.post('/api/stellar/submit-tx', async (req, res) => {
  try {
    const { signedXDR } = req.body;
    if (!signedXDR) {
      return res.status(400).json({ success: false, error: 'Missing signedXDR in request body' });
    }

    const transaction = StellarSdk.TransactionBuilder.fromXDR(
      signedXDR,
      NETWORK === 'PUBLIC'
        ? StellarSdk.Networks.PUBLIC
        : StellarSdk.Networks.TESTNET
    );

    const result = await server.submitTransaction(transaction);

    // Record transaction locally
    transactions.push({
      id: result.id,
      hash: result.hash,
      ledger: result.ledger,
      status: 'completed',
      createdAt: new Date(),
    });

    res.json({
      success: true,
      data: {
        id: result.id,
        hash: result.hash,
        ledger: result.ledger,
      },
    });
  } catch (err) {
    const extras = err?.response?.data?.extras;
    res.status(400).json({
      success: false,
      error: 'Transaction submission failed',
      details: extras?.result_codes || err.message,
    });
  }
});

// ── Stellar: Network Info ──────────────────────────────────────────

app.get('/api/stellar/network', (_req, res) => {
  res.json({
    network: NETWORK,
    horizon: HORIZON_URL,
    passphrase:
      NETWORK === 'PUBLIC'
        ? StellarSdk.Networks.PUBLIC
        : StellarSdk.Networks.TESTNET,
  });
});

// ── Health Check ───────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    network: NETWORK,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ── Start Server ───────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n  ★  EduPay Backend running on port ${PORT}`);
  console.log(`     Network: ${NETWORK}`);
  console.log(`     Horizon: ${HORIZON_URL}\n`);
});
