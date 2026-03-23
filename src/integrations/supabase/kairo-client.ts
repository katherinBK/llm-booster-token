import { createClient } from '@supabase/supabase-js';

// Este cliente se conecta al proyecto independiente de Supabase.com
// Se usa solo para las tablas de api_keys y usage_logs.
// El login/auth sigue manejándose por el cliente principal (Lovable).

const KAIRO_URL = import.meta.env.VITE_SUPABASE_KAIRO_URL;
const KAIRO_ANON_KEY = import.meta.env.VITE_SUPABASE_KAIRO_ANON_KEY;

export const kairoSupabase = createClient(KAIRO_URL, KAIRO_ANON_KEY);
