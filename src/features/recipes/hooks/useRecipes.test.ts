import { describe, it, expect } from "vitest";
import { calculateRecipeMacros } from "./useRecipes";
import type { RecipeItem } from "@/types/database";

describe("calculateRecipeMacros", () => {
  it("calcula correctamente la suma total y el desglose por porción", () => {
    const items: RecipeItem[] = [
      {
        ingredientId: "food-1",
        ingredientName: "Avena",
        quantityGrams: 100,
        calories: 389,
        proteinG: 16.9,
        carbsG: 66.3,
        fatG: 6.9,
      },
      {
        ingredientId: "food-2",
        ingredientName: "Huevo",
        quantityGrams: 100,
        calories: 155,
        proteinG: 13,
        carbsG: 1.1,
        fatG: 11,
      },
    ];

    const result = calculateRecipeMacros(items, 2);

    expect(result.totalCalories).toBe(544); // 389 + 155
    expect(result.caloriesPerServing).toBe(272); // 544 / 2
    expect(result.proteinPerServing).toBeCloseTo(14.95, 1);
    expect(result.carbsPerServing).toBeCloseTo(33.7, 1);
    expect(result.fatPerServing).toBeCloseTo(8.95, 1);
  });
});
