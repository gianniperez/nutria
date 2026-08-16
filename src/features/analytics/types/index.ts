import type { AnthropometricEntry } from "@/types/database";

export interface WeightCycleDataPoint {
  date: string;
  weightKg: number;
  cycleDay: number;
  phase: "menstrual" | "follicular" | "ovulatory" | "luteal";
  phaseName: string;
}

export interface MoodCaloriePoint {
  date: string;
  moodScore: number;
  calories: number;
  targetCalories: number;
  isDeficit: boolean;
}

export interface HabitStreakStats {
  currentStreak: number;
  longestStreak: number;
  totalLoggedDays: number;
  complianceRatePercent: number;
}

export type { AnthropometricEntry };
