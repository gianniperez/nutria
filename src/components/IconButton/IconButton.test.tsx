import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("renderiza con aria-label accesible", () => {
    render(<IconButton aria-label="Favorito" icon={<span>⭐</span>} />);
    expect(screen.getByLabelText("Favorito")).toBeDefined();
  });
});
