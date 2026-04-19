/**
 * API utility for communicating with the backend
 */

const API_BASE = 'http://localhost:3001/api';

/**
 * Send a message to the AI chat (Groq API via backend)
 */
export async function sendChatMessage(message, context = '') {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get AI response');
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to the server. Make sure the backend is running on port 3001.');
    }
    throw error;
  }
}

/**
 * Get AI explanation for a transaction
 */
export async function explainTransaction(transactionData) {
  try {
    const response = await fetch(`${API_BASE}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction: transactionData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get explanation');
    }

    const data = await response.json();
    return data.explanation;
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return null; // Fallback to local explanation
    }
    throw error;
  }
}

/**
 * Health check
 */
export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
