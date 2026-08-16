import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToggleSwitch } from "./ToggleSwitch";

describe("ToggleSwitch", () => {
  it("alterna el estado al hacer clic", () => {
    const handleChange = vi.fn();
    render(<ToggleSwitch checked={false} onChange={handleChange} label="Nota de Amor" />);
    
    const switchEl = screen.getByRole("switch");
    fireEvent.click(switchEl);

    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
