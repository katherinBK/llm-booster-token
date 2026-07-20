export type SupabaseAuthOptions = {
  autoRefreshToken?: boolean;
  persistSession?: boolean;
};

export const resolveSupabaseAuthOptions = (
  overrides: SupabaseAuthOptions = {}
) => ({
  persistSession: true,
  autoRefreshToken: false,
  ...overrides,
});
