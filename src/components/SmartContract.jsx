import { useState, useEffect } from 'react';
import { FiBox, FiSend, FiRefreshCw, FiCheckCircle, FiAlertCircle, FiClock, FiHash } from 'react-icons/fi';
import { isContractConfigured, readMessage, readMessageCount, readOwner, updateMessage } from '../utils/contract';
import { shortenAddress } from '../utils/wallet';
import './SmartContract.css';

export default function SmartContract({ wallet }) {
  const [message, setMessage] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [owner, setOwner] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [txStatus, setTxStatus] = useState(null); // null | 'pending' | 'success' | 'error'
  const [txHash, setTxHash] = useState('');
  const [txError, setTxError] = useState('');
  const [loading, setLoading] = useState(false);
  const configured = isContractConfigured();

  const fetchContractData = async () => {
    if (!configured || !wallet?.provider) return;
    setLoading(true);
    try {
      const [msg, count, own] = await Promise.all([
        readMessage(wallet.provider),
        readMessageCount(wallet.provider),
        readOwner(wallet.provider),
      ]);
      setMessage(msg);
      setMessageCount(count);
      setOwner(own);
    } catch (err) {
      console.error('Failed to read contract:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractData();
  }, [wallet, configured]);

  const handleUpdateMessage = async () => {
    if (!newMessage.trim() || !wallet?.signer) return;

    setTxStatus('pending');
    setTxHash('');
    setTxError('');

    try {
      const result = await updateMessage(wallet.signer, newMessage.trim());
      setTxStatus('success');
      setTxHash(result.hash);
      setNewMessage('');
      // Refresh data
      await fetchContractData();
    } catch (err) {
      setTxStatus('error');
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        setTxError('Transaction rejected by user.');
      } else {
        setTxError(err.reason || err.message || 'Transaction failed');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUpdateMessage();
    }
  };

  // Not configured state
  if (!configured) {
    return (
      <div className="contract-section glass-card fade-in" id="smart-contract">
        <div className="contract-header">
          <div className="contract-icon-wrap">
            <FiBox className="contract-icon" />
          </div>
          <div>
            <h3>Smart Contract</h3>
            <p className="text-muted">On-chain message storage on HeLa</p>
          </div>
        </div>
        <div className="contract-not-configured">
          <div className="not-configured-icon">📄</div>
          <h4>Contract Not Deployed</h4>
          <p>Deploy the smart contract to HeLa and add the address to use this feature.</p>
          <div className="deploy-steps">
            <div className="deploy-step">
              <span className="step-num">1</span>
              <span>Open <a href="https://remix.ethereum.org" target="_blank" rel="noopener noreferrer">Remix IDE</a></span>
            </div>
            <div className="deploy-step">
              <span className="step-num">2</span>
              <span>Paste <code>AIWalletAssistant.sol</code> and compile</span>
            </div>
            <div className="deploy-step">
              <span className="step-num">3</span>
              <span>Deploy to HeLa Testnet via MetaMask</span>
            </div>
            <div className="deploy-step">
              <span className="step-num">4</span>
              <span>Paste address in <code>contractConfig.js</code></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contract-section glass-card fade-in" id="smart-contract">
      <div className="contract-header">
        <div className="contract-icon-wrap">
          <FiBox className="contract-icon" />
        </div>
        <div>
          <h3>Smart Contract</h3>
          <p className="text-muted">On-chain message storage on HeLa</p>
        </div>
        <button
          className="btn-icon refresh-btn"
          onClick={fetchContractData}
          disabled={loading}
          title="Refresh"
        >
          <FiRefreshCw className={loading ? 'spin' : ''} />
        </button>
      </div>

      {/* Contract Data */}
      <div className="contract-data">
        <div className="contract-data-card">
          <div className="data-label">
            <FiBox /> Current Message
          </div>
          <div className="data-value message-value">
            {loading ? '...' : (message || 'No message yet')}
          </div>
        </div>

        <div className="contract-data-grid">
          <div className="contract-data-card small">
            <div className="data-label">
              <FiHash /> Updates
            </div>
            <div className="data-value">{loading ? '...' : messageCount}</div>
          </div>
          <div className="contract-data-card small">
            <div className="data-label">
              <FiCheckCircle /> Owner
            </div>
            <div className="data-value">{loading ? '...' : shortenAddress(owner)}</div>
          </div>
        </div>
      </div>

      {/* Update Message */}
      {wallet ? (
        <div className="contract-update">
          <h4>Update On-Chain Message</h4>
          <div className="contract-input-wrap">
            <input
              className="input-field"
              placeholder="Enter new message (max 280 chars)..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={280}
              disabled={txStatus === 'pending'}
              id="contract-message-input"
            />
            <button
              className="btn btn-primary"
              onClick={handleUpdateMessage}
              disabled={!newMessage.trim() || txStatus === 'pending'}
              id="contract-update-btn"
            >
              {txStatus === 'pending' ? (
                <>
                  <div className="spinner"></div>
                  Sending...
                </>
              ) : (
                <>
                  <FiSend /> Update
                </>
              )}
            </button>
          </div>
          <div className="char-count">{newMessage.length}/280</div>

          {/* Transaction Status */}
          {txStatus === 'success' && (
            <div className="tx-status tx-success slide-up">
              <FiCheckCircle />
              <div>
                <strong>Transaction Confirmed!</strong>
                {txHash && (
                  <p className="tx-hash">
                    TX: <code>{txHash.slice(0, 10)}...{txHash.slice(-8)}</code>
                  </p>
                )}
              </div>
            </div>
          )}

          {txStatus === 'error' && (
            <div className="tx-status tx-error slide-up">
              <FiAlertCircle />
              <div>
                <strong>Transaction Failed</strong>
                <p>{txError}</p>
              </div>
            </div>
          )}

          {txStatus === 'pending' && (
            <div className="tx-status tx-pending slide-up">
              <FiClock />
              <div>
                <strong>Transaction Pending...</strong>
                <p>Please confirm in MetaMask</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="contract-connect-notice">
          <p>🔗 Connect your wallet to update the on-chain message</p>
        </div>
      )}
    </div>
  );
}
