import { describe, it, expect } from "vitest";
import {
  calculateAge,
  calculateBMR,
  calculateTDEE,
  calculateBMI,
  calculateDailyTargetCalories,
  calculateMacros,
  calculateExerciseCalories,
} from "./nutritionCalculations";
import type { UserProfile } from "@/types/database";

describe("nutritionCalculations", () => {
  it("calcula la edad correctamente", () => {
    const age = calculateAge("2000-01-01");
    expect(age).toBeGreaterThanOrEqual(24);
  });

  it("calcula TMB con Mifflin-St Jeor para mujer (60kg, 165cm, 26 años)", () => {
    // TMB = 10*60 + 6.25*165 - 5*26 - 161 = 600 + 1031.25 - 130 - 161 = 1340.25 -> 1340
    const bmr = calculateBMR(60, 165, 26);
    expect(bmr).toBe(1340);
  });

  it("calcula GET / TDEE con factor de actividad moderado (1.55)", () => {
    // 1340 * 1.55 = 2077
    const tdee = calculateTDEE(1340, "moderate");
    expect(tdee).toBe(2077);
  });

  it("calcula IMC y clasifica en categoría Normal", () => {
    const bmiResult = calculateBMI(60, 165);
    expect(bmiResult.bmi).toBe(22.0);
    expect(bmiResult.category).toBe("Peso normal");
  });

  it("calcula déficit calórico respetando la meta", () => {
    const target = calculateDailyTargetCalories(2077, "moderate_loss", 300);
    expect(target).toBe(1777);
  });

  it("calcula macros en modo peso corporal (g/kg)", () => {
    const mockProfile: UserProfile = {
      userId: "test-user",
      weightKg: 60,
      heightCm: 165,
      birthDate: "1998-01-01",
      activityLevel: "moderate",
      goalType: "moderate_loss",
      customDeficitKcal: 300,
      macroCalculationMode: "body_weight",
      proteinGramsPerKg: 2.0,
      fatGramsPerKg: 0.9,
      selectedTheme: "matcha-peach",
      cycleLengthDays: 28,
      periodDurationDays: 5,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const macros = calculateMacros(mockProfile);

    expect(macros.proteinGrams).toBe(120); // 60 * 2.0
    expect(macros.fatGrams).toBe(54); // 60 * 0.9
    expect(macros.carbsGrams).toBeGreaterThan(0);
    expect(macros.targetCalories).toBeGreaterThan(1000);
  });

  it("calcula gasto de ejercicio basado en METs y peso corporal", () => {
    // Pesas (MET 5.5, 60kg, 60min) -> 5.5 * 60 * 1 = 330 kcal
    expect(calculateExerciseCalories(5.5, 60, 60)).toBe(330);

    // Baile hard / techno (MET 7.3, 60kg, 60min) -> 7.3 * 60 * 1 = 438 kcal
    expect(calculateExerciseCalories(7.3, 60, 60)).toBe(438);

    // Caminata 3km/h (MET 2.8, 60kg, 60min) -> 2.8 * 60 * 1 = 168 kcal
    expect(calculateExerciseCalories(2.8, 60, 60)).toBe(168);

    // Running (MET 9.0, 70kg, 30min) -> 9.0 * 70 * 0.5 = 315 kcal
    expect(calculateExerciseCalories(9.0, 70, 30)).toBe(315);
  });
});

