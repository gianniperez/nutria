import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  it("limpia el texto al presionar el botón de limpiar", () => {
    const handleChange = vi.fn();
    render(<SearchInput value="Avena" onChange={handleChange} />);
    
    const clearBtn = screen.getByLabelText("Limpiar búsqueda");
    fireEvent.click(clearBtn);

    expect(handleChange).toHaveBeenCalledWith("");
  });
});
