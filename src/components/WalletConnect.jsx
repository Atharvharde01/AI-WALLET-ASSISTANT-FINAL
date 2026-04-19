import { useState, useEffect } from 'react';
import { FiLink, FiExternalLink, FiCopy, FiCheck, FiZap } from 'react-icons/fi';
import { SiEthereum } from 'react-icons/si';
import { connectWallet, disconnectWallet, shortenAddress, isMetaMaskInstalled, switchToHeLa, onWalletChange } from '../utils/wallet';
import './WalletConnect.css';

export default function WalletConnect({ wallet, setWallet }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Listen for wallet changes
    onWalletChange((event) => {
      if (event.type === 'accountsChanged') {
        if (event.accounts.length === 0) {
          handleDisconnect();
        } else {
          // Re-connect with new account
          handleConnect();
        }
      } else if (event.type === 'chainChanged') {
        handleConnect();
      }
    });
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    setError('');
    try {
      const walletData = await connectWallet();
      setWallet(walletData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setWallet(null);
    setError('');
  };

  const handleSwitchNetwork = async () => {
    setLoading(true);
    try {
      await switchToHeLa(true);
      // Re-fetch wallet data after switch
      const walletData = await connectWallet();
      setWallet(walletData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isMetaMaskInstalled()) {
    return (
      <div className="wallet-section glass-card fade-in">
        <div className="wallet-header">
          <div className="wallet-icon-wrap">
            <SiEthereum className="wallet-icon" />
          </div>
          <div>
            <h3>Wallet Connection</h3>
            <p className="text-muted">Connect your MetaMask wallet</p>
          </div>
        </div>
        <div className="wallet-alert wallet-alert-warning">
          <FiExternalLink />
          <div>
            <strong>MetaMask Required</strong>
            <p>Please install the <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">MetaMask extension</a> to connect your wallet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-section glass-card fade-in" id="wallet-connect">
      <div className="wallet-header">
        <div className="wallet-icon-wrap">
          <SiEthereum className="wallet-icon" />
        </div>
        <div>
          <h3>Wallet Connection</h3>
          <p className="text-muted">
            {wallet ? 'Connected to MetaMask' : 'Connect your MetaMask wallet'}
          </p>
        </div>
        <div className="wallet-status">
          <span className={`status-dot ${wallet ? 'connected' : 'disconnected'}`}></span>
          <span className="status-text">{wallet ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      {error && (
        <div className="wallet-alert wallet-alert-error fade-in">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {wallet ? (
        <div className="wallet-info slide-up">
          <div className="wallet-address-row">
            <div className="wallet-address-label">Address</div>
            <div className="wallet-address-value">
              <code>{shortenAddress(wallet.address)}</code>
              <button className="btn-icon" onClick={copyAddress} title="Copy address">
                {copied ? <FiCheck className="icon-success" /> : <FiCopy />}
              </button>
            </div>
          </div>

          <div className="wallet-details-grid">
            <div className="wallet-detail-card">
              <span className="detail-label">Balance</span>
              <span className="detail-value">{parseFloat(wallet.balance).toFixed(4)}</span>
              <span className="detail-unit">HELA</span>
            </div>
            <div className="wallet-detail-card">
              <span className="detail-label">Network</span>
              <span className="detail-value">{wallet.network}</span>
              <span className="detail-unit">Chain {wallet.chainId}</span>
            </div>
          </div>

          <div className="wallet-actions">
            {wallet.chainId !== 666888 && (
              <button className="btn btn-secondary btn-sm" onClick={handleSwitchNetwork} disabled={loading}>
                <FiZap /> Switch to HeLa
              </button>
            )}
            <button className="btn btn-danger btn-sm" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <button
          className="btn btn-primary btn-lg wallet-connect-btn"
          onClick={handleConnect}
          disabled={loading}
          id="connect-wallet-btn"
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Connecting...
            </>
          ) : (
            <>
              <FiLink /> Connect MetaMask
            </>
          )}
        </button>
      )}
    </div>
  );
}
