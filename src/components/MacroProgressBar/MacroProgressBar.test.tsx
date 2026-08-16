import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MacroProgressBar } from "./MacroProgressBar";

describe("MacroProgressBar", () => {
  it("renderiza los labels de los 3 macros", () => {
    render(
      <MacroProgressBar
        currentCarbsG={120}
        targetCarbsG={200}
        currentProteinG={80}
        targetProteinG={120}
        currentFatG={40}
        targetFatG={60}
      />
    );

    expect(screen.getByText("Carbos")).toBeDefined();
    expect(screen.getByText("Proteínas")).toBeDefined();
    expect(screen.getByText("Grasas")).toBeDefined();
  });
});
