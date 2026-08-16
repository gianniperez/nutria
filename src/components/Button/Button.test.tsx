import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renderiza correctamente el contenido hijo", () => {
    render(<Button>Guardar Comida</Button>);
    expect(screen.getByText("Guardar Comida")).toBeDefined();
  });
});
