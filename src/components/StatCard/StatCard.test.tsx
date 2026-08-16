import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("renderiza el título, valor y unidad", () => {
    render(<StatCard title="TMB Estimada" value="1,450" unit="kcal" />);
    expect(screen.getByText("TMB Estimada")).toBeDefined();
    expect(screen.getByText("1,450")).toBeDefined();
    expect(screen.getByText("kcal")).toBeDefined();
  });
});
