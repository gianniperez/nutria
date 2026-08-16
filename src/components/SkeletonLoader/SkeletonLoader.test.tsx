import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SkeletonLoader } from "./SkeletonLoader";

describe("SkeletonLoader", () => {
  it("renderiza la cantidad de loaders solicitada", () => {
    const { container } = render(<SkeletonLoader count={3} variant="text" />);
    expect(container.querySelectorAll(".animate-pulse").length).toBe(3);
  });
});
