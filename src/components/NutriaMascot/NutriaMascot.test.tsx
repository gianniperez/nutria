import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { NutriaMascot } from "./NutriaMascot";

describe("NutriaMascot", () => {
  it("renderiza el SVG para el estado por defecto", () => {
    const { container } = render(<NutriaMascot />);
    expect(container.querySelector("svg")).toBeDefined();
  });

  it("renderiza el estado menstrual si isPeriodActive es true", () => {
    const { container } = render(<NutriaMascot isPeriodActive={true} />);
    expect(container.querySelector("svg")).toBeDefined();
  });
});
