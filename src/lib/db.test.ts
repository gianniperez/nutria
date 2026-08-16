import { describe, it, expect } from "vitest";
import { INITIAL_CURATED_INGREDIENTS } from "./seedData";
import { db } from "./db";

describe("Seed Data & Dexie Database", () => {
  it("debe contener el catálogo enriquecido de alimentos básicos en el seed", () => {
    expect(INITIAL_CURATED_INGREDIENTS.length).toBeGreaterThanOrEqual(70);
  });

  it("cada ingrediente del seed debe tener macros y calorías válidas", () => {
    for (const item of INITIAL_CURATED_INGREDIENTS) {
      expect(item.name).toBeTruthy();
      expect(item.portionGrams).toBeGreaterThan(0);
      expect(item.calories).toBeGreaterThanOrEqual(0);
      expect(item.proteinG).toBeGreaterThanOrEqual(0);
      expect(item.carbsG).toBeGreaterThanOrEqual(0);
      expect(item.fatG).toBeGreaterThanOrEqual(0);
    }
  });

  it("la instancia de Dexie NutriaDB debe estar inicializada con sus tablas", () => {
    expect(db.name).toBe("NutriaDB");
    expect(db.tables.map((t) => t.name)).toEqual(
      expect.arrayContaining([
        "profile",
        "ingredients",
        "recipes",
        "dailyLogs",
        "anthropometry",
        "fasting",
      ])
    );
  });
});
