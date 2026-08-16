"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useAuth } from "@/providers/AuthProvider";
import { profileApi } from "../api/profileApi";
import {
  calculateAge,
  calculateBMR,
  calculateTDEE,
  calculateBMI,
  calculateMacros,
  type MacroDistribution,
  type BMICalculation,
} from "@/utils/nutritionCalculations";
import type { UserProfile } from "@/types/database";

const DEFAULT_FALLBACK_PROFILE: UserProfile = {
  userId: "current_user",
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
  createdAt: 1700000000000,
  updatedAt: 1700000000000,
};

export function useProfile() {
  const { userId } = useAuth();

  // Consulta reactiva en vivo de Dexie
  const liveProfile = useLiveQuery(async () => {
    return await profileApi.getLocalProfile(userId);
  }, [userId]);

  const profile: UserProfile = useMemo(() => {
    if (liveProfile) return liveProfile;
    return {
      ...DEFAULT_FALLBACK_PROFILE,
      userId: userId || "current_user",
    };
  }, [liveProfile, userId]);

  // Aplicar tema en el HTML tag automáticamente según la preferencia del perfil
  useEffect(() => {
    if (typeof document !== "undefined" && profile.selectedTheme) {
      document.documentElement.setAttribute("data-theme", profile.selectedTheme);
    }
  }, [profile.selectedTheme]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      const updatedProfile: UserProfile = {
        ...profile,
        ...updates,
        userId: userId || profile.userId || "current_user",
        updatedAt: Date.now(),
      };

      await profileApi.saveProfile(updatedProfile);

      if (updates.selectedTheme && typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", updates.selectedTheme);
      }
    },
    [profile, userId]
  );

  // Cálculos reactivos instantáneos
  const calculatedAge = useMemo(() => calculateAge(profile.birthDate), [profile.birthDate]);

  const bmr = useMemo(
    () => calculateBMR(profile.weightKg, profile.heightCm, calculatedAge),
    [profile.weightKg, profile.heightCm, calculatedAge]
  );

  const tdee = useMemo(
    () => calculateTDEE(bmr, profile.activityLevel),
    [bmr, profile.activityLevel]
  );

  const bmiInfo: BMICalculation = useMemo(
    () => calculateBMI(profile.weightKg, profile.heightCm),
    [profile.weightKg, profile.heightCm]
  );

  const macros: MacroDistribution = useMemo(() => calculateMacros(profile), [profile]);

  return {
    profile,
    isLoading: liveProfile === undefined,
    updateProfile,
    calculatedAge,
    bmr,
    tdee,
    bmiInfo,
    macros,
  };
}
