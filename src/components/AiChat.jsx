import { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageSquare, FiUser, FiZap, FiAlertCircle } from 'react-icons/fi';
import { sendChatMessage, checkServerHealth } from '../utils/api';
import './AiChat.css';

const SUGGESTED_QUESTIONS = [
  "What is a gas fee?",
  "How do token approvals work?",
  "What is a rug pull?",
  "How to stay safe in DeFi?",
  "What is HeLa blockchain?",
];

export default function AiChat() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hey! 👋 I'm your AI Wallet Assistant powered by Groq AI. Ask me anything about Web3, transactions, or crypto safety!",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    checkServerHealth().then(setServerOnline);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text = input) => {
    const msg = text.trim();
    if (!msg || loading) return;

    const userMessage = { role: 'user', content: msg };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendChatMessage(msg);
      setMessages((prev) => [...prev, { role: 'ai', content: reply }]);
      setServerOnline(true);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: `⚠️ ${error.message}\n\nMake sure the backend server is running:\n\`cd server && node index.js\``,
          isError: true,
        },
      ]);
      setServerOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-section glass-card fade-in" id="ai-chat">
      <div className="chat-header">
        <div className="chat-icon-wrap">
          <FiMessageSquare className="chat-icon" />
        </div>
        <div>
          <h3>AI Chat <span className="powered-by">Powered by Groq AI</span></h3>
          <p className="text-muted">Ask anything about Web3 and crypto</p>
        </div>
        <div className="server-status">
          {serverOnline === null ? (
            <span className="badge badge-info">Checking...</span>
          ) : serverOnline ? (
            <span className="badge badge-safe">🟢 Online</span>
          ) : (
            <span className="badge badge-danger">🔴 Offline</span>
          )}
        </div>
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="suggested-questions fade-in">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              className="suggested-q"
              onClick={() => sendMessage(q)}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.role === 'user' ? 'msg-user' : 'msg-ai'} ${msg.isError ? 'msg-error' : ''} fade-in`}
          >
            <div className="msg-avatar">
              {msg.role === 'user' ? <FiUser /> : <FiZap />}
            </div>
            <div className="msg-bubble">
              <div className="msg-role">{msg.role === 'user' ? 'You' : 'AI Assistant'}</div>
              <div className="msg-content">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message msg-ai fade-in">
            <div className="msg-avatar"><FiZap /></div>
            <div className="msg-bubble">
              <div className="msg-role">AI Assistant</div>
              <div className="msg-typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-wrap">
        <input
          className="input-field chat-input"
          placeholder="Ask about Web3, transactions, or crypto safety..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          id="chat-input"
        />
        <button
          className="btn btn-primary chat-send-btn"
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          id="chat-send-btn"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}
