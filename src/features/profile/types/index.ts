import type { UserProfile } from "@/types/database";
import type { MacroDistribution, BMICalculation } from "@/utils/nutritionCalculations";

export interface ProfileContextState {
  profile: UserProfile | null;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  calculatedAge: number;
  bmr: number;
  tdee: number;
  bmiInfo: BMICalculation;
  macros: MacroDistribution;
}
