import { describe, it, expect } from "vitest";
import { createEmptyDailyLog } from "./useDiary";

describe("useDiary logic & helpers", () => {
  it("crea un log vacío con las 5 comidas inicializadas", () => {
    const log = createEmptyDailyLog("2026-08-15", "test-user");

    expect(log.date).toBe("2026-08-15");
    expect(log.userId).toBe("test-user");
    expect(log.meals.breakfast).toEqual([]);
    expect(log.meals.lunch).toEqual([]);
    expect(log.meals.snack_afternoon).toEqual([]);
    expect(log.meals.snack).toEqual([]);
    expect(log.meals.dinner).toEqual([]);
    expect(log.exercises).toEqual([]);
    expect(log.hasLoveNote).toBe(false);
    expect(log.isPeriodActive).toBe(false);
  });
});
