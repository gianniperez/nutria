import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SegmentedControl } from "./SegmentedControl";

describe("SegmentedControl", () => {
  it("renderiza las opciones y maneja la selección", () => {
    const handleChange = vi.fn();
    const options = [
      { value: "day", label: "Día" },
      { value: "week", label: "Semana" },
    ];

    render(<SegmentedControl options={options} value="day" onChange={handleChange} />);
    
    expect(screen.getByText("Día")).toBeDefined();
    expect(screen.getByText("Semana")).toBeDefined();

    fireEvent.click(screen.getByText("Semana"));
    expect(handleChange).toHaveBeenCalledWith("week");
  });
});
