export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    const SUPABASE_URL = process.env.SUPABASE_KAIRO_URL || process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_KAIRO_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error('Missing Supabase URL or Service Key in env');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const tokenUrl = `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/token?grant_type=password`;

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('Supabase auth error', { url: tokenUrl, status: response.status, body: data });
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Auth signin function error', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
