import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CircularProgress } from "./CircularProgress";

describe("CircularProgress", () => {
  it("renderiza el porcentaje y el contenido central", () => {
    render(
      <CircularProgress value={75}>
        <span>1,500 kcal</span>
      </CircularProgress>
    );

    expect(screen.getByText("1,500 kcal")).toBeDefined();
  });
});
