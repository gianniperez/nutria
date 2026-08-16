import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NumberInput } from "./NumberInput";

describe("NumberInput", () => {
  it("incrementa el valor al hacer click en el botón +", () => {
    const handleChange = vi.fn();
    render(<NumberInput label="Porción" value={100} onChange={handleChange} step={10} unit="g" />);
    
    const plusButton = screen.getByLabelText("Aumentar");
    fireEvent.click(plusButton);

    expect(handleChange).toHaveBeenCalledWith(110);
  });

  it("disminuye el valor al hacer click en el botón -", () => {
    const handleChange = vi.fn();
    render(<NumberInput label="Porción" value={100} onChange={handleChange} step={10} unit="g" />);
    
    const minusButton = screen.getByLabelText("Disminuir");
    fireEvent.click(minusButton);

    expect(handleChange).toHaveBeenCalledWith(90);
  });

  it("sincroniza el displayValue cuando la prop value cambia externamente", () => {
    const { rerender } = render(<NumberInput label="Porción" value={50} onChange={vi.fn()} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("50");

    rerender(<NumberInput label="Porción" value={75.5} onChange={vi.fn()} />);
    expect(input.value).toBe("75,5");
  });

  it("permite escribir números y llama a onChange", () => {
    const handleChange = vi.fn();
    render(<NumberInput label="Porción" value={50} onChange={handleChange} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "80" } });
    expect(handleChange).toHaveBeenCalledWith(80);
  });
});
