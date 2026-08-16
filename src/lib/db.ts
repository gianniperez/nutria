import Dexie, { type Table } from "dexie";
import type {
  UserProfile,
  Ingredient,
  Recipe,
  DailyLog,
  AnthropometricEntry,
  FastingSession,
} from "@/types/database";
import { INITIAL_CURATED_INGREDIENTS } from "./seedData";

export class NutriaDB extends Dexie {
  profile!: Table<UserProfile, string>;
  ingredients!: Table<Ingredient, string>;
  recipes!: Table<Recipe, string>;
  dailyLogs!: Table<DailyLog, string>;
  anthropometry!: Table<AnthropometricEntry, string>;
  fasting!: Table<FastingSession, string>;

  constructor() {
    super("NutriaDB");

    this.version(1).stores({
      profile: "userId",
      ingredients: "id, userId, name, isFavorite, createdAt",
      recipes: "id, userId, name, createdAt",
      dailyLogs: "date, userId, isPeriodActive, moodScore, updatedAt",
      anthropometry: "id, userId, date, createdAt",
      fasting: "id, userId, isActive",
    });

    // Seed inicial automático al crear la base de datos local
    this.on("populate", () => {
      const defaultUserId = "current_user";

      // Insertar ingredientes curados
      const seededIngredients: Ingredient[] = INITIAL_CURATED_INGREDIENTS.map(
        (item) => ({
          ...item,
          userId: defaultUserId,
        })
      );

      this.ingredients.bulkAdd(seededIngredients);

      // Insertar perfil por defecto
      const defaultProfile: UserProfile = {
        userId: defaultUserId,
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
        lastPeriodDate: "2026-08-01",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      this.profile.add(defaultProfile);
    });
  }
}

export const db = new NutriaDB();

/**
 * Garantiza que todos los alimentos curados de seedData estén presentes en Dexie.
 */
export async function ensureSeedIngredientsLoaded(targetUserId = "current_user"): Promise<void> {
  try {
    const existing = await db.ingredients.toArray();
    const existingIds = new Set(existing.map((item) => item.id));

    const missing = INITIAL_CURATED_INGREDIENTS.filter((seed) => !existingIds.has(seed.id)).map(
      (seed) => ({
        ...seed,
        userId: targetUserId || "current_user",
      })
    );

    if (missing.length > 0) {
      await db.ingredients.bulkPut(missing);
    }
  } catch (err) {
    console.warn("Error asegurando seed ingredients:", err);
  }
}
