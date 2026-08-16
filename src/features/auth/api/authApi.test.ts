import { describe, it, expect } from "vitest";
import { formatAuthErrorMessage } from "./authApi";

describe("authApi formatting", () => {
  it("traduce correctamente los códigos de error comunes de Firebase al español", () => {
    expect(formatAuthErrorMessage(new Error("auth/invalid-email"))).toContain("no es válido");
    expect(formatAuthErrorMessage(new Error("auth/user-not-found"))).toContain("incorrectos");
    expect(formatAuthErrorMessage(new Error("auth/weak-password"))).toContain("6 caracteres");
    expect(formatAuthErrorMessage(new Error("auth/email-already-in-use"))).toContain("Ya existe una cuenta");
  });
});
