// Stub de integración Lovable — deshabilitado fuera del editor de Lovable.
// La librería @lovable.dev/cloud-auth-js solo funciona dentro de la plataforma
// Lovable y apunta a un proyecto interno de Supabase que no es accesible en
// producción. Al exportar un stub vacío evitamos que se intenten peticiones a
// ese proyecto inexistente.

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

export const lovable = {
  auth: {
    signInWithOAuth: async (_provider: "google" | "apple", _opts?: SignInOptions) => {
      return { error: new Error("OAuth via Lovable no está disponible en producción. Usa Supabase directamente.") };
    },
  },
};
