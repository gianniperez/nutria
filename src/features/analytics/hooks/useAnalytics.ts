"use client";

import { useMemo, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/features/profile";
import { getCyclePhaseInfo } from "@/utils/menstrualCycleCalculations";
import { analyticsApi } from "../api/analyticsApi";
import type { AnthropometricEntry } from "@/types/database";
import type { WeightCycleDataPoint, MoodCaloriePoint, HabitStreakStats } from "../types";

export function useAnalytics() {
  const { userId } = useAuth();
  const { profile, macros } = useProfile();
  const targetCalories = macros?.targetCalories || 1800;

  // Cargar logs diarios para analíticas
  const dailyLogs = useLiveQuery(async () => {
    const logs = await db.dailyLogs.toArray();
    return logs.sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  // Cargar medidas corporales
  const anthropometryHistory = useLiveQuery(async () => {
    return await analyticsApi.getAnthropometricEntries(userId);
  }, [userId]);

  // 1. Puntos de Gráfico: Peso vs Fases del Ciclo
  const weightVsCyclePoints: WeightCycleDataPoint[] = useMemo(() => {
    if (!dailyLogs) return [];

    const lastPeriodDate = profile?.lastPeriodDate || "2026-08-01";

    return dailyLogs
      .filter((log) => log.weightEntryKg && log.weightEntryKg > 0)
      .map((log) => {
        const cycleInfo = getCyclePhaseInfo(
          log.date,
          lastPeriodDate,
          profile?.cycleLengthDays || 28,
          profile?.periodDurationDays || 5
        );

        return {
          date: log.date,
          weightKg: log.weightEntryKg || 0,
          cycleDay: cycleInfo.cycleDay,
          phase: cycleInfo.phase,
          phaseName: cycleInfo.phaseName,
        };
      });
  }, [dailyLogs, profile]);

  // 2. Puntos de Correlación: Ánimo vs Calorías
  const moodCorrelationPoints: MoodCaloriePoint[] = useMemo(() => {
    if (!dailyLogs) return [];

    return dailyLogs
      .filter((log) => typeof log.moodScore === "number")
      .map((log) => {
        let totalCalories = 0;
        if (log.meals) {
          for (const slot of ["breakfast", "lunch", "snack_afternoon", "snack", "dinner"] as const) {
            for (const item of log.meals[slot] || []) {
              totalCalories += item.calories || 0;
            }
          }
        }

        return {
          date: log.date,
          moodScore: log.moodScore || 3,
          calories: Math.round(totalCalories),
          targetCalories,
          isDeficit: totalCalories <= targetCalories,
        };
      });
  }, [dailyLogs, targetCalories]);

  // 3. Estadísticas de Racha de Hábitos
  const habitStats: HabitStreakStats = useMemo(() => {
    if (!dailyLogs || dailyLogs.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalLoggedDays: 0,
        complianceRatePercent: 0,
      };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let totalCompliant = 0;

    for (const log of dailyLogs) {
      let calories = 0;
      if (log.meals) {
        for (const slot of ["breakfast", "lunch", "snack_afternoon", "snack", "dinner"] as const) {
          for (const item of log.meals[slot] || []) {
            calories += item.calories || 0;
          }
        }
      }

      if (calories > 0) {
        currentStreak++;
        if (currentStreak > longestStreak) longestStreak = currentStreak;

        if (Math.abs(calories - targetCalories) <= targetCalories * 0.15) {
          totalCompliant++;
        }
      } else {
        currentStreak = 0;
      }
    }

    return {
      currentStreak: Math.max(currentStreak, dailyLogs.length > 0 ? 1 : 0),
      longestStreak: Math.max(longestStreak, 1),
      totalLoggedDays: dailyLogs.length,
      complianceRatePercent: Math.round((totalCompliant / Math.max(1, dailyLogs.length)) * 100),
    };
  }, [dailyLogs, targetCalories]);

  // Guardar medición antropométrica
  const addMeasurement = useCallback(
    async (data: Omit<AnthropometricEntry, "id" | "userId" | "createdAt">) => {
      const newEntry: AnthropometricEntry = {
        id: `anthro-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: userId || "current_user",
        ...data,
        createdAt: Date.now(),
      };

      await analyticsApi.saveAnthropometricEntry(newEntry);
      return newEntry;
    },
    [userId]
  );

  const deleteMeasurement = useCallback(
    async (id: string) => {
      await analyticsApi.deleteAnthropometricEntry(id, userId);
    },
    [userId]
  );

  return {
    weightVsCyclePoints,
    moodCorrelationPoints,
    habitStats,
    anthropometryHistory: anthropometryHistory || [],
    addMeasurement,
    deleteMeasurement,
  };
}
