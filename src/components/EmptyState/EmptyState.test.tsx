import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renderiza el título y descripción", () => {
    render(<EmptyState title="No hay recetas aún" description="Crea tu primera receta favorita." />);
    expect(screen.getByText("No hay recetas aún")).toBeDefined();
    expect(screen.getByText("Crea tu primera receta favorita.")).toBeDefined();
  });
});
