import { useState } from 'react';
import { FiSearch, FiAlertTriangle, FiCheckCircle, FiAlertCircle, FiInfo, FiZap } from 'react-icons/fi';
import { analyzeTransaction, getRiskClass, getExampleTransactions } from '../utils/transactionEngine';
import { explainTransaction } from '../utils/api';
import './TransactionAnalyzer.css';

export default function TransactionAnalyzer() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setAiExplanation('');

    // Local analysis (instant)
    const analysis = analyzeTransaction(input);
    setResult(analysis);

    // Try to get AI-powered explanation from backend
    try {
      const aiResponse = await explainTransaction(input);
      if (aiResponse) {
        setAiExplanation(aiResponse);
      }
    } catch {
      // Silently fall back to local analysis
    }

    setLoading(false);
  };

  const handleExample = (example) => {
    setInput(example.value);
    setResult(null);
    setAiExplanation('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'safe': return <FiCheckCircle />;
      case 'warning': return <FiAlertCircle />;
      case 'danger': return <FiAlertTriangle />;
      default: return <FiAlertTriangle />;
    }
  };

  return (
    <div className="analyzer-section glass-card fade-in" id="transaction-analyzer">
      <div className="analyzer-header">
        <div className="analyzer-icon-wrap">
          <FiSearch className="analyzer-icon" />
        </div>
        <div>
          <h3>Transaction Analyzer</h3>
          <p className="text-muted">Enter a transaction to analyze its risk and get an explanation</p>
        </div>
      </div>

      {/* Example transactions */}
      <div className="example-chips">
        <span className="chips-label">Try:</span>
        {getExampleTransactions().map((ex) => (
          <button
            key={ex.type}
            className="example-chip"
            onClick={() => handleExample(ex)}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="analyzer-input-wrap">
        <textarea
          className="input-field"
          placeholder="e.g., Approve USDT spending for a DeFi contract..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          id="transaction-input"
        />
        <button
          className="btn btn-primary analyze-btn"
          onClick={handleAnalyze}
          disabled={!input.trim() || loading}
          id="analyze-btn"
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Analyzing...
            </>
          ) : (
            <>
              <FiZap /> Analyze
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="analysis-result slide-up">
          {/* Risk Badge */}
          <div className="result-risk-header">
            <span className={`badge ${getRiskClass(result.risk)}`}>
              {getRiskIcon(result.risk)}
              {result.riskLabel}
            </span>
            <span className="result-type-label">{result.name}</span>
          </div>

          {/* Risk Score Meter */}
          <div className="risk-meter-wrap">
            <div className="risk-meter-labels">
              <span className="meter-label safe">Safe</span>
              <span className="meter-label warning">Medium</span>
              <span className="meter-label danger">High Risk</span>
            </div>
            <div className="risk-meter-track">
              <div
                className="risk-meter-fill"
                style={{ width: `${result.riskScore}%` }}
              ></div>
              <div
                className="risk-meter-marker"
                style={{ left: `${result.riskScore}%` }}
              >
                <span className="marker-score">{result.riskScore}</span>
              </div>
            </div>
            <div className="risk-meter-range">
              <span>0</span>
              <span>Risk Score</span>
              <span>100</span>
            </div>
          </div>

          {/* Explanation Card */}
          <div className="result-card">
            <div className="result-card-header">
              <FiInfo /> <span>Explanation</span>
            </div>
            <p className="result-explanation">{result.explanation}</p>
          </div>

          {/* Risk Detail */}
          <div className={`result-card result-risk-card risk-${result.risk}`}>
            <div className="result-card-header">
              {getRiskIcon(result.risk)} <span>Risk Assessment</span>
            </div>
            <p className="result-explanation">{result.riskDetail}</p>
          </div>

          {/* AI Explanation (if available) */}
          {aiExplanation && (
            <div className="result-card result-ai-card">
              <div className="result-card-header">
                <FiZap className="ai-icon" /> <span>AI Analysis (Groq)</span>
              </div>
              <p className="result-explanation">{aiExplanation}</p>
            </div>
          )}

          {/* Tips */}
          {result.tips && result.tips.length > 0 && (
            <div className="result-tips">
              <h4>💡 Safety Tips</h4>
              <ul>
                {result.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
