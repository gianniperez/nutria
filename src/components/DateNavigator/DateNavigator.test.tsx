import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DateNavigator } from "./DateNavigator";

describe("DateNavigator", () => {
  it("navega al día anterior al presionar el botón correspondiente", () => {
    const handleDateChange = vi.fn();
    render(<DateNavigator selectedDate="2026-08-15" onDateChange={handleDateChange} />);

    const prevBtn = screen.getByLabelText("Día anterior");
    fireEvent.click(prevBtn);

    expect(handleDateChange).toHaveBeenCalledWith("2026-08-14");
  });
});
