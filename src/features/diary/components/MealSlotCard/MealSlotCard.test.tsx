import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MealSlotCard } from "./MealSlotCard";
import type { LoggedFoodItem, MealSlotConfig } from "../../types";

const mockConfig: MealSlotConfig = {
  type: "lunch",
  title: "Almuerzo",
  subtitle: "Comida principal del día",
  iconName: "BowlFood",
};

const mockItems: LoggedFoodItem[] = [
  {
    id: "item-1",
    name: "Huevo entero cocido",
    quantityGrams: 100,
    calories: 155,
    proteinG: 13,
    carbsG: 1.1,
    fatG: 11,
    loggedAt: Date.now(),
  },
  {
    id: "item-2",
    name: "Frutillas frescas",
    quantityGrams: 70,
    calories: 22,
    proteinG: 0.5,
    carbsG: 5.4,
    fatG: 0.2,
    loggedAt: Date.now(),
  },
];

describe("MealSlotCard", () => {
  it("renderiza el título del slot, alimentos y cálculo de calorías totales", () => {
    render(
      <MealSlotCard
        config={mockConfig}
        items={mockItems}
        onAddFood={vi.fn()}
        onRemoveItem={vi.fn()}
      />
    );

    expect(screen.getByText("Almuerzo")).toBeInTheDocument();
    expect(screen.getByText("Huevo entero cocido")).toBeInTheDocument();
    expect(screen.getByText("Frutillas frescas")).toBeInTheDocument();
    // Total calorías 155 + 22 = 177 kcal
    expect(screen.getByText("177 kcal")).toBeInTheDocument();
  });

  it("llama a onAddFood al pulsar el botón Agregar", () => {
    const handleAdd = vi.fn();
    render(
      <MealSlotCard
        config={mockConfig}
        items={mockItems}
        onAddFood={handleAdd}
        onRemoveItem={vi.fn()}
      />
    );

    const addButton = screen.getByRole("button", { name: /agregar/i });
    fireEvent.click(addButton);

    expect(handleAdd).toHaveBeenCalledWith("lunch");
  });

  it("llama a onRemoveItem al pulsar el botón de eliminar alimento", () => {
    const handleRemove = vi.fn();
    render(
      <MealSlotCard
        config={mockConfig}
        items={mockItems}
        onAddFood={vi.fn()}
        onRemoveItem={handleRemove}
      />
    );

    const removeButtons = screen.getAllByLabelText("Eliminar alimento del diario");
    fireEvent.click(removeButtons[0]);

    expect(handleRemove).toHaveBeenCalledWith("lunch", "item-1");
  });

  it("llama a onEditItem al pulsar el botón de editar alimento", () => {
    const handleEdit = vi.fn();
    render(
      <MealSlotCard
        config={mockConfig}
        items={mockItems}
        onAddFood={vi.fn()}
        onRemoveItem={vi.fn()}
        onEditItem={handleEdit}
      />
    );

    const editButtons = screen.getAllByLabelText("Editar cantidad del alimento");
    fireEvent.click(editButtons[0]);

    expect(handleEdit).toHaveBeenCalledWith("lunch", mockItems[0]);
  });
});

