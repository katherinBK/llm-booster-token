// Re-exportamos el cliente principal de Supabase como `kairoSupabase`.
// Ambos clientes apuntan al mismo proyecto (wyywukatjjksaetvoekg),
// así que usar una única instancia evita errores de variables mal configuradas.
export { supabase as kairoSupabase } from './client';
