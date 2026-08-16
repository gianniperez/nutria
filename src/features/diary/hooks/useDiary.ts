"use client";

import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/features/profile";
import { getCyclePhaseInfo } from "@/utils/menstrualCycleCalculations";
import { diaryApi } from "../api/diaryApi";
import type {
  DailyLog,
  LoggedFoodItem,
  MealType,
  ExerciseEntry,
  FastingSession,
  Ingredient,
  Recipe,
} from "@/types/database";
import type { DailyNutritionalSummary, StagedMealItem } from "../types";

export function createEmptyDailyLog(date: string, userId = "current_user"): DailyLog {
  return {
    date,
    userId,
    meals: {
      breakfast: [],
      lunch: [],
      snack_afternoon: [],
      snack: [],
      dinner: [],
    },
    exercises: [],
    moodScore: undefined,
    moodNote: "",
    hasLoveNote: false,
    isPeriodStart: false,
    isPeriodEnd: false,
    isPeriodActive: false,
    weightEntryKg: undefined,
    fastingDurationMinutes: undefined,
    updatedAt: Date.now(),
  };
}

export function useDiary(initialDate?: string) {
  const { userId } = useAuth();
  const { profile, macros } = useProfile();

  const todayStr = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || todayStr);
  const [lutealAdjustmentKcal, setLutealAdjustmentKcal] = useState<number>(0);

  // Consulta reactiva del log del día en Dexie
  const liveDailyLog = useLiveQuery(async () => {
    return await diaryApi.getDailyLog(selectedDate);
  }, [selectedDate, userId]);

  const dailyLog: DailyLog = useMemo(() => {
    return liveDailyLog || createEmptyDailyLog(selectedDate, userId || "current_user");
  }, [liveDailyLog, selectedDate, userId]);

  // Consulta reactiva del ayuno actual
  const liveFastingSession = useLiveQuery(async () => {
    return await diaryApi.getActiveFastingSession();
  }, [userId]);

  // Información del ciclo menstrual para la fecha seleccionada
  const cycleInfo = useMemo(() => {
    const lastPeriodDate = profile?.lastPeriodDate || "2026-08-01";
    return getCyclePhaseInfo(
      selectedDate,
      lastPeriodDate,
      profile?.cycleLengthDays || 28,
      profile?.periodDurationDays || 5
    );
  }, [selectedDate, profile]);

  // Resumen nutricional consolidado
  const summary: DailyNutritionalSummary = useMemo(() => {
    let ingestedCalories = 0;
    let ingestedProteinG = 0;
    let ingestedCarbsG = 0;
    let ingestedFatG = 0;

    // Sumar items de las 5 comidas
    const mealSlots: MealType[] = [
      "breakfast",
      "lunch",
      "snack_afternoon",
      "snack",
      "dinner",
    ];

    for (const slot of mealSlots) {
      const items = dailyLog.meals[slot] || [];
      for (const item of items) {
        ingestedCalories += item.calories || 0;
        ingestedProteinG += item.proteinG || 0;
        ingestedCarbsG += item.carbsG || 0;
        ingestedFatG += item.fatG || 0;
      }
    }

    // Sumar calorías quemadas en ejercicios
    const burnedCalories = (dailyLog.exercises || []).reduce(
      (acc, ex) => acc + (ex.caloriesBurned || 0),
      0
    );

    const targetCalories = (macros?.targetCalories || 1800) + lutealAdjustmentKcal;
    const remainingCalories = targetCalories - ingestedCalories + burnedCalories;

    return {
      targetCalories,
      ingestedCalories: Math.round(ingestedCalories),
      burnedCalories: Math.round(burnedCalories),
      lutealAdjustmentKcal,
      remainingCalories: Math.round(remainingCalories),
      ingestedProteinG: Math.round(ingestedProteinG),
      targetProteinG: macros?.proteinGrams || 120,
      ingestedCarbsG: Math.round(ingestedCarbsG),
      targetCarbsG: macros?.carbsGrams || 180,
      ingestedFatG: Math.round(ingestedFatG),
      targetFatG: macros?.fatGrams || 50,
    };
  }, [dailyLog, macros, lutealAdjustmentKcal]);

  // Guardar cambios en el log del día
  const persistLog = useCallback(
    async (updated: DailyLog) => {
      await diaryApi.saveDailyLog({
        ...updated,
        userId: userId || updated.userId || "current_user",
        updatedAt: Date.now(),
      });
    },
    [userId]
  );

  // 1. Registrar Alimento (Snapshot Pattern Inmutable)
  const logFoodItem = useCallback(
    async (mealType: MealType, food: Ingredient, quantityGrams: number) => {
      const basePortion = food.portionGrams || 100;
      const factor = quantityGrams / basePortion;

      const newItem: LoggedFoodItem = {
        id: `log-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ingredientId: food.id,
        name: food.name,
        quantityGrams,
        calories: Math.round(food.calories * factor),
        proteinG: Number((food.proteinG * factor).toFixed(1)),
        carbsG: Number((food.carbsG * factor).toFixed(1)),
        fatG: Number((food.fatG * factor).toFixed(1)),
        loggedAt: Date.now(),
      };

      const updatedMeals = {
        ...dailyLog.meals,
        [mealType]: [...(dailyLog.meals[mealType] || []), newItem],
      };

      await persistLog({
        ...dailyLog,
        meals: updatedMeals,
      });
    },
    [dailyLog, persistLog]
  );

  // 2. Registrar Porción de Receta (Bloque Consolidado)
  const logRecipeServing = useCallback(
    async (mealType: MealType, recipe: Recipe, servingsCount = 1) => {
      const servingLabel =
        servingsCount === 1
          ? `1 porción de ${recipe.name}`
          : `${servingsCount} porciones de ${recipe.name}`;

      const newItem: LoggedFoodItem = {
        id: `log-recipe-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        recipeId: recipe.id,
        name: servingLabel,
        quantityGrams: servingsCount,
        calories: Math.round(recipe.caloriesPerServing * servingsCount),
        proteinG: Number((recipe.proteinPerServing * servingsCount).toFixed(1)),
        carbsG: Number((recipe.carbsPerServing * servingsCount).toFixed(1)),
        fatG: Number((recipe.fatPerServing * servingsCount).toFixed(1)),
        loggedAt: Date.now(),
      };

      const updatedMeals = {
        ...dailyLog.meals,
        [mealType]: [...(dailyLog.meals[mealType] || []), newItem],
      };

      await persistLog({
        ...dailyLog,
        meals: updatedMeals,
      });
    },
    [dailyLog, persistLog]
  );

  // 3. Registrar Lote Múltiple de Alimentos y Recetas
  const logMultipleItemsToMeal = useCallback(
    async (mealType: MealType, items: StagedMealItem[]) => {
      if (!items || items.length === 0) return;

      const newLoggedItems: LoggedFoodItem[] = items.map((staged, idx) => {
        const uniqueId = `log-${staged.type}-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
        return {
          id: uniqueId,
          ingredientId: staged.type === "food" ? staged.food?.id : undefined,
          recipeId: staged.type === "recipe" ? staged.recipe?.id : undefined,
          name: staged.name,
          quantityGrams: staged.quantity,
          calories: staged.calories,
          proteinG: staged.proteinG,
          carbsG: staged.carbsG,
          fatG: staged.fatG,
          loggedAt: Date.now(),
        };
      });

      const updatedMeals = {
        ...dailyLog.meals,
        [mealType]: [...(dailyLog.meals[mealType] || []), ...newLoggedItems],
      };

      await persistLog({
        ...dailyLog,
        meals: updatedMeals,
      });
    },
    [dailyLog, persistLog]
  );

  // 4. Reordenar Items de una Comida
  const reorderMealItems = useCallback(
    async (mealType: MealType, newItems: LoggedFoodItem[]) => {
      const updatedMeals = {
        ...dailyLog.meals,
        [mealType]: newItems,
      };

      await persistLog({
        ...dailyLog,
        meals: updatedMeals,
      });
    },
    [dailyLog, persistLog]
  );

  // 5. Eliminar Item de Comida
  const removeMealItem = useCallback(
    async (mealType: MealType, itemId: string) => {
      const updatedMeals = {
        ...dailyLog.meals,
        [mealType]: (dailyLog.meals[mealType] || []).filter((item) => item.id !== itemId),
      };

      await persistLog({
        ...dailyLog,
        meals: updatedMeals,
      });
    },
    [dailyLog, persistLog]
  );

  // 6. Actualizar Cantidad de un Item de Comida
  const updateMealItemQuantity = useCallback(
    async (mealType: MealType, itemId: string, newQuantity: number) => {
      const currentItems = dailyLog.meals[mealType] || [];
      const itemToUpdate = currentItems.find((i) => i.id === itemId);
      if (!itemToUpdate || newQuantity <= 0) return;

      const prevQty = itemToUpdate.quantityGrams || 1;
      const factor = newQuantity / prevQty;

      const updatedItem: LoggedFoodItem = {
        ...itemToUpdate,
        quantityGrams: newQuantity,
        calories: Math.round(itemToUpdate.calories * factor),
        proteinG: Number((itemToUpdate.proteinG * factor).toFixed(1)),
        carbsG: Number((itemToUpdate.carbsG * factor).toFixed(1)),
        fatG: Number((itemToUpdate.fatG * factor).toFixed(1)),
        loggedAt: Date.now(),
      };

      const updatedMeals = {
        ...dailyLog.meals,
        [mealType]: currentItems.map((item) => (item.id === itemId ? updatedItem : item)),
      };

      await persistLog({
        ...dailyLog,
        meals: updatedMeals,
      });
    },
    [dailyLog, persistLog]
  );

  // 7. Registrar Ejercicio (Cálculo Proporcional)
  const logExercise = useCallback(
    async (
      name: string,
      durationMinutes: number,
      baseCalories = 250,
      baseDurationMinutes = 45
    ) => {
      const factor = durationMinutes / (baseDurationMinutes || 45);
      const caloriesBurned = Math.round(baseCalories * factor);

      const newEntry: ExerciseEntry = {
        id: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name,
        durationMinutes,
        baseDurationMinutes,
        baseCalories,
        caloriesBurned,
        loggedAt: Date.now(),
      };

      await persistLog({
        ...dailyLog,
        exercises: [...(dailyLog.exercises || []), newEntry],
      });
    },
    [dailyLog, persistLog]
  );

  // 7. Eliminar Ejercicio
  const removeExercise = useCallback(
    async (exerciseId: string) => {
      await persistLog({
        ...dailyLog,
        exercises: (dailyLog.exercises || []).filter((ex) => ex.id !== exerciseId),
      });
    },
    [dailyLog, persistLog]
  );

  // 8. Ayuno Intermitente
  const startFasting = useCallback(
    async (targetHours = 16) => {
      const newSession: FastingSession = {
        id: "current_fasting",
        userId: userId || "current_user",
        startTime: Date.now(),
        targetHours,
        isActive: true,
      };
      await diaryApi.saveFastingSession(newSession);
    },
    [userId]
  );

  const endFasting = useCallback(async () => {
    if (!liveFastingSession) return;
    const elapsedMinutes = Math.round((Date.now() - liveFastingSession.startTime) / 60000);

    await diaryApi.saveFastingSession({
      ...liveFastingSession,
      isActive: false,
      completedAt: Date.now(),
    });

    // Guardar duración en el log del día
    await persistLog({
      ...dailyLog,
      fastingDurationMinutes: elapsedMinutes,
    });
  }, [liveFastingSession, dailyLog, persistLog]);

  // 9. Bienestar & Salud Hormonal
  const setMood = useCallback(
    async (score: 1 | 2 | 3 | 4 | 5, note = "") => {
      await persistLog({
        ...dailyLog,
        moodScore: score,
        moodNote: note,
      });
    },
    [dailyLog, persistLog]
  );

  const toggleLoveNote = useCallback(async () => {
    await persistLog({
      ...dailyLog,
      hasLoveNote: !dailyLog.hasLoveNote,
    });
  }, [dailyLog, persistLog]);

  const togglePeriod = useCallback(async () => {
    await persistLog({
      ...dailyLog,
      isPeriodActive: !dailyLog.isPeriodActive,
    });
  }, [dailyLog, persistLog]);

  const applyLutealAdjustment = useCallback((amount = 150) => {
    setLutealAdjustmentKcal(amount);
  }, []);

  return {
    selectedDate,
    setSelectedDate,
    dailyLog,
    summary,
    cycleInfo,
    fastingSession: liveFastingSession,
    logFoodItem,
    logRecipeServing,
    logMultipleItemsToMeal,
    reorderMealItems,
    removeMealItem,
    updateMealItemQuantity,
    logExercise,
    removeExercise,
    startFasting,
    endFasting,
    setMood,
    toggleLoveNote,
    togglePeriod,
    applyLutealAdjustment,
    lutealAdjustmentKcal,
  };
}
