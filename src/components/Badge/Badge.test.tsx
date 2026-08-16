import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renderiza el texto correctamente con la variante adecuada", () => {
    render(<Badge variant="protein">35g Proteína</Badge>);
    expect(screen.getByText("35g Proteína")).toBeDefined();
  });
});
