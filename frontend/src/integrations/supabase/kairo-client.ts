// Re-export the single shared Supabase client for all Kairo data queries.
// Using one instance avoids race conditions and duplicate auth listeners.
export { supabase as kairoSupabase } from './client';
