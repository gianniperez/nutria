import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { EditMealItemModal } from "./EditMealItemModal";
import type { LoggedFoodItem } from "../../types";

const mockItem: LoggedFoodItem = {
  id: "item-1",
  name: "Huevo entero cocido",
  quantityGrams: 100,
  calories: 155,
  proteinG: 13,
  carbsG: 1.1,
  fatG: 11,
  loggedAt: Date.now(),
};

describe("EditMealItemModal", () => {
  it("renderiza el modal con los datos actuales del alimento", () => {
    render(
      <EditMealItemModal
        isOpen={true}
        onClose={vi.fn()}
        mealType="lunch"
        mealTitle="Almuerzo"
        item={mockItem}
        onSaveQuantity={vi.fn()}
      />
    );

    expect(screen.getByText("Editar cantidad")).toBeInTheDocument();
    expect(screen.getByText("Huevo entero cocido")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("100");
  });

  it("llama a onSaveQuantity con la cantidad actualizada", async () => {
    const handleSave = vi.fn().mockResolvedValue(undefined);
    render(
      <EditMealItemModal
        isOpen={true}
        onClose={vi.fn()}
        mealType="lunch"
        mealTitle="Almuerzo"
        item={mockItem}
        onSaveQuantity={handleSave}
      />
    );

    const saveButton = screen.getByRole("button", { name: /guardar/i });
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(handleSave).toHaveBeenCalledWith("lunch", "item-1", 100);
  });
});

