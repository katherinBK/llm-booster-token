import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// The correct Supabase project URL. This guard prevents any stale build cache
// or incorrectly injected environment variable from routing to the wrong project.
const envUrl = import.meta.env.VITE_SUPABASE_URL as string;
const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const SUPABASE_URL =
  !envUrl || envUrl.includes('bqcktccunwqgpsgejwhy') || envUrl.includes('placeholder')
    ? 'https://wyywukatjjksaetvoekg.supabase.co'
    : envUrl;

const SUPABASE_ANON_KEY =
  !envKey || envKey.includes('placeholder')
    ? ''
    : envKey;

if (!SUPABASE_ANON_KEY) {
  console.warn(
    '[Supabase] VITE_SUPABASE_PUBLISHABLE_KEY is missing. ' +
    'Set it in your .env.local file (local) or Vercel environment variables (production).'
  );
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});