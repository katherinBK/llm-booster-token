import express from 'express';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const SUPABASE_URL = process.env.SUPABASE_KAIRO_URL || process.env.VITE_SUPABASE_URL || "https://wyywukatjjksaetvoekg.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_KAIRO_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5eXd1a2F0amprc2FldHZvZWtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDIwMjEwMywiZXhwIjoyMDg5Nzc4MTAzfQ.NKWGQSPYM_m_PZfzixG0ioI9nVnbKhPRTv4ZYjrFbtw";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn('Auth proxy: missing SUPABASE_URL or SUPABASE_SERVICE_KEY in env');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Supabase auth error', { url: tokenUrl, status: response.status, body: data });
      return res.status(response.status).json(data);
    }

    console.log('Auth proxy signin success', { url: tokenUrl, status: response.status });
    return res.json(data);
  } catch (err) {
    console.error('Auth proxy /signin error', err);
    return res.status(500).json({ error: err.message || 'Internal auth proxy error' });
  }
});

// Proxy sign up to Supabase Auth (Admin create user to bypass email confirmation)
router.post('/signup', async (req, res) => {
  try {
    const { email, password, data } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    // Use admin.createUser to bypass email confirmation automatically
    const { data: user, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: data
    });

    if (error) {
      console.error('Supabase auth admin signup error', error);
      return res.status(error.status || 400).json({ error: error.message });
    }

    console.log('Auth admin signup success', { email });
    return res.json({ user });
  } catch (err) {
    console.error('Auth proxy /signup error', err);
    return res.status(500).json({ error: err.message || 'Internal auth proxy error' });
  }
});

export default router;
