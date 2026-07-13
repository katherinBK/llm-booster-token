import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const SUPABASE_URL = "https://wyywukatjjksaetvoekg.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5eXd1a2F0amprc2FldHZvZWtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDIwMjEwMywiZXhwIjoyMDg5Nzc4MTAzfQ.NKWGQSPYM_m_PZfzixG0ioI9nVnbKhPRTv4ZYjrFbtw";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn('Auth proxy: missing SUPABASE_URL or SUPABASE_SERVICE_KEY in env');
}

// Proxy sign in with password to Supabase Auth (server-side to avoid CORS)
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    const tokenUrl = `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/token?grant_type=password`;

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Log detailed info to help debugging in production
      console.error('Supabase auth error', {
        url: tokenUrl,
        status: response.status,
        statusText: response.statusText,
        body: data,
      });
      return res.status(response.status).json(data);
    }

    // Success: log minimal info
    console.log('Auth proxy signin success', { url: tokenUrl, status: response.status });
    return res.json(data);
  } catch (err) {
    console.error('Auth proxy /signin error', err);
    return res.status(500).json({ error: err.message || 'Internal auth proxy error' });
  }
});

// Proxy sign up to Supabase Auth (server-side to avoid CORS and rely on service key)
router.post('/signup', async (req, res) => {
  try {
    const { email, password, data } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    const signupUrl = `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/signup`;

    const response = await fetch(signupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ email, password, data }),
    });

    const body = await response.json();
    if (!response.ok) {
      console.error('Supabase auth signup error', {
        url: signupUrl,
        status: response.status,
        statusText: response.statusText,
        body,
      });
      return res.status(response.status).json(body);
    }

    console.log('Auth proxy signup success', { url: signupUrl, status: response.status });
    return res.json(body);
  } catch (err) {
    console.error('Auth proxy /signup error', err);
    return res.status(500).json({ error: err.message || 'Internal auth proxy error' });
  }
});

export default router;
