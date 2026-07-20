// Lovable integration stub — disabled outside the Lovable editor.
// This file exists solely to satisfy imports so the app compiles in production.
// It must NOT initialize any real auth client, as it would target the wrong Supabase project.
export const lovable = {
  auth: {
    signInWithOAuth: async () => ({
      error: new Error("OAuth via Lovable is disabled in production. Use Supabase directly."),
    }),
  },
};
