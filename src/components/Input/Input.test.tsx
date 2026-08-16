import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("renderiza label y placeholder correctamente", () => {
    render(<Input label="Nombre del Alimento" placeholder="Ej. Avena" />);
    expect(screen.getByText("Nombre del Alimento")).toBeDefined();
    expect(screen.getByPlaceholderText("Ej. Avena")).toBeDefined();
  });
});
