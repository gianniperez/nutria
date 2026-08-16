import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("renderiza el contenido con estilos de tarjeta", () => {
    render(<Card><p>Contenido de prueba</p></Card>);
    expect(screen.getByText("Contenido de prueba")).toBeDefined();
  });
});
