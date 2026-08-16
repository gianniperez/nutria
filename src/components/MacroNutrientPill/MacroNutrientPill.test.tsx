import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MacroNutrientPill } from "./MacroNutrientPill";

describe("MacroNutrientPill", () => {
  it("renderiza el valor y unidad correspondiente", () => {
    render(<MacroNutrientPill type="protein" value={30} />);
    expect(screen.getByText("Proteína")).toBeDefined();
    expect(screen.getByText("30g")).toBeDefined();
  });
});
