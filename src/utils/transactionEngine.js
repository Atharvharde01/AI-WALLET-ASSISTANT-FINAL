/**
 * Transaction Explanation & Risk Detection Engine
 * Predefined transaction types with plain-English explanations and risk levels
 */

// Transaction type definitions with numeric risk scores (0-100)
const TRANSACTION_TYPES = {
  'send_eth': {
    name: 'Send ETH / Native Token',
    explanation: 'This transaction sends cryptocurrency from your wallet to another address. Once confirmed, this cannot be reversed.',
    risk: 'safe',
    riskScore: 15,
    riskLabel: '🟢 Safe',
    riskDetail: 'Standard token transfer. Make sure you verify the recipient address carefully.',
    tips: [
      'Double-check the receiving address',
      'Start with a small test amount for new addresses',
      'Gas fees apply to this transaction'
    ]
  },
  'approve_token': {
    name: 'Approve Token Spending',
    explanation: 'This allows a smart contract or application to spend your tokens on your behalf. The approved party can move tokens from your wallet up to the approved amount.',
    risk: 'danger',
    riskScore: 85,
    riskLabel: '🔴 Risky',
    riskDetail: 'Approval grants spending access. Unlimited approvals are especially dangerous — a malicious contract could drain your tokens.',
    tips: [
      'Only approve contracts you trust',
      'Set a specific spending limit instead of unlimited',
      'Revoke unused approvals periodically',
      'Check the contract on a block explorer first'
    ]
  },
  'swap_tokens': {
    name: 'Swap Tokens',
    explanation: 'This exchanges one cryptocurrency for another through a decentralized exchange. The rate may vary depending on market conditions and liquidity.',
    risk: 'warning',
    riskScore: 45,
    riskLabel: '🟡 Medium',
    riskDetail: 'Swaps involve price slippage risk. The amount you receive may differ from the quoted amount.',
    tips: [
      'Check the slippage tolerance setting',
      'Compare rates across different DEXs',
      'Be cautious of tokens with very low liquidity'
    ]
  },
  'mint_nft': {
    name: 'Mint NFT',
    explanation: 'This creates a new NFT (digital collectible) on the blockchain. You\'ll pay a minting fee plus gas fees.',
    risk: 'warning',
    riskScore: 55,
    riskLabel: '🟡 Medium',
    riskDetail: 'Verify the NFT project is legitimate. Scam mints can drain wallets through hidden contract calls.',
    tips: [
      'Research the NFT project before minting',
      'Check the smart contract source code',
      'Be wary of "free mint" offers — gas and hidden fees may apply'
    ]
  },
  'stake_tokens': {
    name: 'Stake Tokens',
    explanation: 'This locks your tokens in a staking contract to earn rewards. Your tokens will be locked for a period and cannot be transferred.',
    risk: 'warning',
    riskScore: 40,
    riskLabel: '🟡 Medium',
    riskDetail: 'Staking locks your funds. Make sure you understand the lock-up period and unstaking conditions.',
    tips: [
      'Understand the lock-up period',
      'Check the APR/APY carefully',
      'Verify the staking contract is audited'
    ]
  },
  'bridge_tokens': {
    name: 'Bridge Tokens',
    explanation: 'This moves your tokens from one blockchain to another through a bridge protocol. Bridge transactions can take time and involve multiple steps.',
    risk: 'danger',
    riskScore: 75,
    riskLabel: '🔴 Risky',
    riskDetail: 'Bridges have been targets of major hacks. Only use well-established bridges with strong security track records.',
    tips: [
      'Use only reputable, audited bridge protocols',
      'Start with a small amount to test',
      'Be patient — cross-chain transfers take time',
      'Verify the bridge contract addresses'
    ]
  },
  'withdraw': {
    name: 'Withdraw Funds',
    explanation: 'This withdraws your funds from a DeFi protocol, staking contract, or liquidity pool back to your wallet.',
    risk: 'safe',
    riskScore: 20,
    riskLabel: '🟢 Safe',
    riskDetail: 'Withdrawals return your funds to your wallet. Check for any early withdrawal penalties.',
    tips: [
      'Check for early withdrawal penalties',
      'Verify the withdrawal amount is correct',
      'Gas fees apply to this transaction'
    ]
  },
  'provide_liquidity': {
    name: 'Provide Liquidity',
    explanation: 'This deposits your tokens into a liquidity pool to earn trading fees. You\'ll receive LP tokens representing your share of the pool.',
    risk: 'warning',
    riskScore: 60,
    riskLabel: '🟡 Medium',
    riskDetail: 'Liquidity provision carries impermanent loss risk. The value of your deposited tokens may change relative to simply holding them.',
    tips: [
      'Understand impermanent loss before providing liquidity',
      'Start with stablecoin pairs for lower risk',
      'Monitor your position regularly',
      'Check the pool\'s TVL and volume'
    ]
  },
  'contract_interaction': {
    name: 'Smart Contract Interaction',
    explanation: 'This interacts with a smart contract on the blockchain. The contract will execute code that may transfer tokens, change settings, or perform other actions.',
    risk: 'warning',
    riskScore: 50,
    riskLabel: '🟡 Medium',
    riskDetail: 'Unknown contract interactions carry risk. Always verify the contract\'s purpose and audit status.',
    tips: [
      'Check if the contract is verified on the block explorer',
      'Look for audit reports',
      'Be extra cautious with unverified contracts'
    ]
  },
  'unknown': {
    name: 'Unknown Transaction',
    explanation: 'This transaction type is not recognized. It could be a complex contract interaction or a new type of operation.',
    risk: 'danger',
    riskScore: 95,
    riskLabel: '🔴 High Risk',
    riskDetail: 'Unknown transactions are the most dangerous. If you don\'t understand what it does, DO NOT sign it.',
    tips: [
      'DO NOT sign transactions you don\'t understand',
      'Ask an expert before proceeding',
      'Never rush into signing transactions',
      'If in doubt, reject the transaction'
    ]
  }
};

/**
 * Detect transaction type from user input
 */
export function detectTransactionType(input) {
  const lower = input.toLowerCase().trim();
  
  if (lower.includes('send') || lower.includes('transfer') || lower.includes('pay')) {
    return 'send_eth';
  }
  if (lower.includes('approve') || lower.includes('allowance') || lower.includes('permit')) {
    return 'approve_token';
  }
  if (lower.includes('swap') || lower.includes('exchange') || lower.includes('trade')) {
    return 'swap_tokens';
  }
  if (lower.includes('mint') || lower.includes('nft') || lower.includes('collectible')) {
    return 'mint_nft';
  }
  if (lower.includes('stake') || lower.includes('lock') || lower.includes('delegate')) {
    return 'stake_tokens';
  }
  if (lower.includes('bridge') || lower.includes('cross-chain') || lower.includes('cross chain')) {
    return 'bridge_tokens';
  }
  if (lower.includes('withdraw') || lower.includes('unstake') || lower.includes('claim')) {
    return 'withdraw';
  }
  if (lower.includes('liquidity') || lower.includes('pool') || lower.includes('lp')) {
    return 'provide_liquidity';
  }
  if (lower.includes('contract') || lower.includes('interact') || lower.includes('call') || lower.includes('execute')) {
    return 'contract_interaction';
  }
  
  return 'unknown';
}

/**
 * Get full transaction analysis
 */
export function analyzeTransaction(input) {
  const type = detectTransactionType(input);
  const info = TRANSACTION_TYPES[type];
  
  return {
    type,
    ...info,
    userInput: input,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get risk color class
 */
export function getRiskClass(risk) {
  switch (risk) {
    case 'safe': return 'badge-safe';
    case 'warning': return 'badge-warning';
    case 'danger': return 'badge-danger';
    default: return 'badge-danger';
  }
}

/**
 * Get predefined transaction examples for the demo
 */
export function getExampleTransactions() {
  return [
    { label: 'Send ETH', value: 'Send 0.5 ETH to 0xAbc123...', type: 'send_eth' },
    { label: 'Approve Token', value: 'Approve USDT spending for Uniswap contract', type: 'approve_token' },
    { label: 'Swap Tokens', value: 'Swap 100 USDC for ETH on DEX', type: 'swap_tokens' },
    { label: 'Bridge', value: 'Bridge 50 USDC from Ethereum to HeLa', type: 'bridge_tokens' },
    { label: 'Stake', value: 'Stake 50 HELA tokens for rewards', type: 'stake_tokens' },
    { label: 'Unknown', value: 'Call function 0x1234abcd on unverified contract', type: 'unknown' },
  ];
}

export default TRANSACTION_TYPES;
