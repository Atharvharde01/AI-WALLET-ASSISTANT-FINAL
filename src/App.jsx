import { useState, useEffect } from 'react';
import { FiShield, FiGithub, FiExternalLink } from 'react-icons/fi';
import { SiEthereum } from 'react-icons/si';
import WalletConnect from './components/WalletConnect';
import TransactionAnalyzer from './components/TransactionAnalyzer';
import AiChat from './components/AiChat';
import './App.css';

function App() {
  const [wallet, setWallet] = useState(null);
  const [activeTab, setActiveTab] = useState('analyzer');

  return (
    <div className="app">
      {/* Floating orbs background */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-group">
            <div className="logo-icon">
              <FiShield />
            </div>
            <div>
              <h1 className="logo-text">AI Wallet Assistant</h1>
              <p className="logo-sub">Powered by HeLa • Groq AI</p>
            </div>
          </div>
          <nav className="header-nav">
            <a
              href="https://helachain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              <SiEthereum /> HeLa
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content slide-up">
          <div className="hero-badge">
            <span className="badge badge-info">🚀 Web3 Hackathon Project</span>
          </div>
          <h2 className="hero-title">
            Understand Your <span className="gradient-text">Crypto Transactions</span>
          </h2>
          <p className="hero-description">
            AI-powered transaction explanations, risk detection, and Web3 guidance — 
            built for beginners, powered by Groq AI on HeLa Blockchain.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <div className="feature-dot safe"></div>
              <span>Transaction Explainer</span>
            </div>
            <div className="hero-feature">
              <div className="feature-dot warning"></div>
              <span>Risk Detection</span>
            </div>
            <div className="hero-feature">
              <div className="feature-dot accent"></div>
              <span>AI Chat (Groq)</span>
            </div>
            <div className="hero-feature">
              <div className="feature-dot info"></div>
              <span>MetaMask Connect</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        {/* Wallet Connection — always visible */}
        <div className="section-block">
          <WalletConnect wallet={wallet} setWallet={setWallet} />
        </div>

        {/* Tab Navigation */}
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'analyzer' ? 'active' : ''}`}
            onClick={() => setActiveTab('analyzer')}
            id="tab-analyzer"
          >
            <FiShield /> Transaction Analyzer
          </button>
          <button
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
            id="tab-chat"
          >
            <FiExternalLink /> AI Chat
          </button>
        </div>

        {/* Tab Content */}
        <div className="section-block">
          {activeTab === 'analyzer' && <TransactionAnalyzer />}
          {activeTab === 'chat' && <AiChat />}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Built with ❤️ for Web3 Hackathon — AI Wallet Assistant on HeLa Blockchain
          </p>
          <div className="footer-links">
            <span className="footer-tech">React + Vite + ethers.js + Groq API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
