const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// =============================================
// Groq API Configuration
// =============================================
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// System prompt for the AI
const SYSTEM_PROMPT = `You are an AI Wallet Assistant specialized in Web3 and cryptocurrency. 
Your role is to:
- Explain crypto transactions in simple, beginner-friendly language
- Warn users about risky actions (token approvals, unknown contracts, etc.)
- Answer questions about Web3, DeFi, NFTs, and blockchain
- Help users understand what happens when they sign transactions
- Provide safety tips for using crypto wallets

Keep responses concise (2-4 paragraphs max), friendly, and educational.
Use emojis sparingly for visual clarity.
Always prioritize user safety in your recommendations.
You are deployed on HeLa Blockchain.`;

/**
 * Call Grok API
 */
async function callGroqAPI(userMessage, context = '') {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured. Add it to your .env file.');
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  if (context) {
    messages.push({
      role: 'system',
      content: `Context: ${context}`,
    });
  }

  messages.push({ role: 'user', content: userMessage });

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Groq API error:', response.status, errorData);
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// =============================================
// Routes
// =============================================

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    groqConfigured: !!GROQ_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

/**
 * AI Chat endpoint
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const reply = await callGroqAPI(message, context);
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to get AI response',
    });
  }
});

/**
 * Transaction explanation endpoint
 */
app.post('/api/explain', async (req, res) => {
  try {
    const { transaction } = req.body;

    if (!transaction) {
      return res.status(400).json({ error: 'Transaction data is required' });
    }

    const prompt = `Explain this crypto transaction in simple language for a beginner. 
What exactly happens when they confirm this? What should they be careful about?

Transaction: ${transaction}`;

    const explanation = await callGroqAPI(prompt);
    res.json({ explanation });
  } catch (error) {
    console.error('Explain error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to explain transaction',
    });
  }
});

// =============================================
// Start Server
// =============================================
app.listen(PORT, () => {
  console.log(`\n🚀 AI Wallet Assistant Backend`);
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log(`   Groq API: ${GROQ_API_KEY ? '✅ Configured' : '❌ Not configured (add GROQ_API_KEY to .env)'}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
