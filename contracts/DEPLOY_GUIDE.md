# 🚀 Deploy AIWalletAssistant.sol on HeLa Testnet

## Prerequisites
- MetaMask installed with HeLa Testnet configured
- Some testnet HELA tokens (from faucet)

## Step 1: Get HeLa Testnet Tokens
1. Go to the HeLa faucet: `https://testnet-faucet.helachain.com`
2. Paste your MetaMask wallet address
3. Request test tokens

## Step 2: Add HeLa Testnet to MetaMask
| Field | Value |
|-------|-------|
| Network Name | HeLa Testnet |
| RPC URL | `https://testnet-rpc.helachain.com` |
| Chain ID | `26112` |
| Symbol | HELA |
| Explorer | `https://testnet-blockscout.helachain.com` |

## Step 3: Deploy via Remix IDE
1. Open [Remix IDE](https://remix.ethereum.org)
2. Create a new file: `AIWalletAssistant.sol`
3. Paste the contract code from `contracts/AIWalletAssistant.sol`
4. Go to **Solidity Compiler** tab:
   - Compiler version: `0.8.19`
   - Click **Compile**
5. Go to **Deploy & Run** tab:
   - Environment: **Injected Provider - MetaMask**
   - Make sure MetaMask is on **HeLa Testnet**
   - In the constructor input, enter: `"Hello from AI Wallet Assistant!"`
   - Click **Deploy**
   - Confirm the transaction in MetaMask
6. After deployment, copy the **contract address** from Remix

## Step 4: Connect to Frontend
1. Open `src/utils/contractConfig.js`
2. Replace the placeholder address with your deployed contract address:
   ```js
   export const CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_ADDRESS_HERE';
   ```
3. Save and refresh the app — the Smart Contract tab will now read/write on-chain!
