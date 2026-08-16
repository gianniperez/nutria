import type {
  DailyLog,
  LoggedFoodItem,
  MealType,
  ExerciseEntry,
  FastingSession,
  Ingredient,
  Recipe,
} from "@/types/database";

export interface MealSlotConfig {
  type: MealType;
  title: string;
  subtitle: string;
  iconName: string;
}

export const MEAL_SLOTS: MealSlotConfig[] = [
  {
    type: "breakfast",
    title: "Desayuno",
    subtitle: "Para arrancar con energía y foco",
    iconName: "Sun",
  },
  {
    type: "lunch",
    title: "Almuerzo",
    subtitle: "Comida principal del día",
    iconName: "BowlFood",
  },
  {
    type: "snack_afternoon",
    title: "Merienda",
    subtitle: "Momento cozy de la tarde",
    iconName: "Coffee",
  },
  {
    type: "snack",
    title: "Snack / Colación",
    subtitle: "Fruta, frutos secos o proteína rápida",
    iconName: "Cookie",
  },
  {
    type: "dinner",
    title: "Cena",
    subtitle: "Para descansar y nutrir el cuerpo",
    iconName: "Moon",
  },
];

export interface DailyNutritionalSummary {
  targetCalories: number;
  ingestedCalories: number;
  burnedCalories: number;
  lutealAdjustmentKcal: number;
  remainingCalories: number;
  ingestedProteinG: number;
  targetProteinG: number;
  ingestedCarbsG: number;
  targetCarbsG: number;
  ingestedFatG: number;
  targetFatG: number;
}

export interface StagedMealItem {
  tempId: string;
  type: "food" | "recipe";
  food?: Ingredient;
  recipe?: Recipe;
  name: string;
  quantity: number; // gramos o porciones
  unit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export type { DailyLog, LoggedFoodItem, MealType, ExerciseEntry, FastingSession };

