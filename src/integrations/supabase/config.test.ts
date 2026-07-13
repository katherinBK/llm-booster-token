import { describe, expect, it } from "vitest";
import { resolveSupabaseAuthOptions } from "./config";

describe("resolveSupabaseAuthOptions", () => {
  it("desactiva el refresco automático por defecto para evitar ciclos de error", () => {
    expect(resolveSupabaseAuthOptions()).toMatchObject({
      autoRefreshToken: false,
      persistSession: true,
    });
  });

  it("habilita el refresco automático solo cuando se solicita explícitamente", () => {
    expect(resolveSupabaseAuthOptions({ autoRefreshToken: true })).toMatchObject({
      autoRefreshToken: true,
      persistSession: true,
    });
  });
});
