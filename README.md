# 🛡️ AI Wallet Assistant

> AI-powered Web3 wallet companion — understand your crypto transactions, detect risks, and get instant Web3 guidance.

Built for **DevClash Hackathon** on **HeLa Blockchain** · Powered by **Groq AI**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔗 **MetaMask Connect** | One-click wallet connection with balance & network display |
| 🔍 **Transaction Analyzer** | Paste any transaction and get a plain-English explanation with risk scoring |
| 📊 **Risk Detection** | Visual risk meter (0-100) with color-coded safety levels |
| 🤖 **AI Chat** | Ask anything about Web3, DeFi, NFTs — powered by Groq (Llama 3.3 70B) |
| 📄 **Smart Contract** | Solidity contract for on-chain message storage on HeLa |

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 8 |
| Styling | Vanilla CSS (glassmorphism dark theme) |
| Wallet | ethers.js v5 + MetaMask |
| AI Backend | Node.js + Express → Groq API |
| AI Model | Llama 3.3 70B Versatile |
| Blockchain | HeLa (EVM-compatible) |
| Smart Contract | Solidity 0.8.19 |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MetaMask](https://metamask.io/) browser extension
- [Groq API key](https://console.groq.com/) (free tier available)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/ai-wallet-assistant.git
cd ai-wallet-assistant

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Configure Environment

Create `server/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

### 3. Run the App

```bash
# Terminal 1 — Backend
cd server
node index.js

# Terminal 2 — Frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
ai-wallet-assistant/
├── contracts/
│   ├── AIWalletAssistant.sol    # Solidity smart contract
│   └── DEPLOY_GUIDE.md          # HeLa deployment instructions
├── server/
│   ├── index.js                 # Express API (Groq integration)
│   ├── .env                     # API keys (not committed)
│   └── package.json
├── src/
│   ├── components/
│   │   ├── WalletConnect.jsx    # MetaMask wallet connection
│   │   ├── TransactionAnalyzer.jsx  # Transaction analysis + risk meter
│   │   ├── AiChat.jsx           # AI chat interface
│   │   └── SmartContract.jsx    # On-chain contract interaction
│   ├── utils/
│   │   ├── wallet.js            # Wallet & HeLa network config
│   │   ├── transactionEngine.js # Risk detection engine
│   │   ├── api.js               # Backend API client
│   │   ├── contract.js          # Smart contract read/write
│   │   └── contractConfig.js    # Contract ABI & address
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔍 How It Works

### Transaction Analyzer

1. User enters or selects a transaction type (send, approve, swap, bridge, etc.)
2. **Local engine** instantly detects the type and returns a risk score (0-100)
3. **Groq AI** provides a detailed, beginner-friendly explanation in parallel
4. Results show a visual risk meter, risk assessment, safety tips, and AI analysis

### Risk Detection Engine

| Transaction | Risk Score | Level |
|------------|-----------|-------|
| Send ETH | 15 | 🟢 Safe |
| Withdraw | 20 | 🟢 Safe |
| Stake Tokens | 40 | 🟡 Medium |
| Swap Tokens | 45 | 🟡 Medium |
| Provide Liquidity | 60 | 🟡 Medium |
| Bridge Tokens | 75 | 🔴 Risky |
| Approve Token | 85 | 🔴 Risky |
| Unknown | 95 | 🔴 High Risk |

### AI Chat

Real-time chat powered by Groq's Llama 3.3 70B model with a Web3-specialized system prompt. Answers questions about gas fees, token approvals, rug pulls, DeFi safety, and more.

---

## 📄 Smart Contract

**`AIWalletAssistant.sol`** — a simple on-chain message storage contract:

- `updateMessage(string)` — store a message on-chain
- `getMessage()` — read the current message
- `getMessageCount()` — total number of updates
- `transferOwnership(address)` — transfer contract ownership

See [`contracts/DEPLOY_GUIDE.md`](contracts/DEPLOY_GUIDE.md) for step-by-step Remix deployment on HeLa Testnet.

---

## 🌐 HeLa Network Config

| | Testnet | Mainnet |
|---|---------|---------|
| RPC | `https://testnet-rpc.helachain.com` | `https://mainnet-rpc.helachain.com` |
| Chain ID | 26112 | 26222 |
| Symbol | HELA | HELA |
| Explorer | [testnet-blockscout.helachain.com](https://testnet-blockscout.helachain.com) | [mainnet-blockscout.helachain.com](https://mainnet-blockscout.helachain.com) |

---

## 🛠️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/chat` | AI chat (body: `{ message, context }`) |
| `POST` | `/api/explain` | Transaction explanation (body: `{ transaction }`) |

---

## 🏗️ Built For

**DevClash Hackathon** — Web3 AI track on HeLa Blockchain

> *Simple + Working + Explainable = WIN* 🚀

---

## 📜 License

MIT
