import type { UserProfile } from "@/types/database";

export interface MacroDistribution {
  targetCalories: number;
  carbsGrams: number;
  proteinGrams: number;
  fatGrams: number;
  carbsPercent: number;
  proteinPercent: number;
  fatPercent: number;
}

export interface BMICalculation {
  bmi: number;
  category: "Bajo peso" | "Peso normal" | "Sobrepeso" | "Obesidad";
  colorClass: string;
}

/**
 * Calcula la edad en años a partir de una fecha de nacimiento (YYYY-MM-DD).
 */
export function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 26; // Default fallback

  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return 26;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return Math.max(1, age);
}

/**
 * Tasa Metabólica Basal (TMB) según la fórmula Mifflin-St Jeor para mujeres:
 * TMB = (10 * peso en kg) + (6.25 * altura en cm) - (5 * edad en años) - 161
 */
export function calculateBMR(weightKg: number, heightCm: number, ageYears: number): number {
  if (weightKg <= 0 || heightCm <= 0 || ageYears <= 0) return 0;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
  return Math.round(Math.max(500, bmr));
}

/**
 * Factores de Actividad Física (PAL - Physical Activity Level)
 */
export const ACTIVITY_MULTIPLIERS: Record<UserProfile["activityLevel"], number> = {
  sedentary: 1.2, // Sedentario (poco o ningún ejercicio)
  light: 1.375, // Ejercicio ligero (1-3 días a la semana)
  moderate: 1.55, // Ejercicio moderado (3-5 días a la semana)
  intense: 1.725, // Ejercicio intenso (6-7 días a la semana)
  very_intense: 1.9, // Atleta / doble jornada diaria
};

/**
 * Gasto Energético Total (GET / TDEE)
 * GET = TMB * PAL
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: UserProfile["activityLevel"]
): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.375;
  return Math.round(bmr * multiplier);
}

/**
 * Índice de Masa Corporal (IMC / BMI)
 * IMC = peso en kg / (altura en metros)^2
 */
export function calculateBMI(weightKg: number, heightCm: number): BMICalculation {
  if (weightKg <= 0 || heightCm <= 0) {
    return { bmi: 0, category: "Peso normal", colorClass: "text-secondary-dark" };
  }

  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5) {
    return { bmi, category: "Bajo peso", colorClass: "text-accent-dark" };
  } else if (bmi < 25) {
    return { bmi, category: "Peso normal", colorClass: "text-secondary-dark" };
  } else if (bmi < 30) {
    return { bmi, category: "Sobrepeso", colorClass: "text-primary-text" };
  } else {
    return { bmi, category: "Obesidad", colorClass: "text-menstrual-dark" };
  }
}

/**
 * Cálculo del Presupuesto Calórico Diario Objetivo según la meta elegida.
 */
export function calculateDailyTargetCalories(
  tdee: number,
  goalType: UserProfile["goalType"],
  customDeficitKcal: number
): number {
  if (goalType === "maintenance") {
    return tdee;
  }

  const deficit = Math.max(100, Math.min(600, customDeficitKcal || 300));
  // Limitar piso de seguridad calórico a un mínimo fisiológico razonable (~1100 kcal)
  return Math.round(Math.max(1100, tdee - deficit));
}

/**
 * Cálculo Dual de Macronutrientes (Gramos y Porcentajes):
 * - Modo peso corporal (g/kg): Proteína (default 2.0g/kg), Grasas (default 0.9g/kg), Carbos (resto de kcal / 4).
 * - Modo porcentaje (%): Carbos%, Proteína%, Grasas% del total calórico.
 */
export function calculateMacros(profile: UserProfile): MacroDistribution {
  const age = calculateAge(profile.birthDate);
  const bmr = calculateBMR(profile.weightKg, profile.heightCm, age);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const targetCalories = calculateDailyTargetCalories(
    tdee,
    profile.goalType,
    profile.customDeficitKcal
  );

  let proteinGrams = 0;
  let fatGrams = 0;
  let carbsGrams = 0;

  if (profile.macroCalculationMode === "body_weight") {
    const proteinMultiplier = profile.proteinGramsPerKg || 2.0;
    const fatMultiplier = profile.fatGramsPerKg || 0.9;

    proteinGrams = Math.round(profile.weightKg * proteinMultiplier);
    fatGrams = Math.round(profile.weightKg * fatMultiplier);

    const proteinCalories = proteinGrams * 4;
    const fatCalories = fatGrams * 9;
    const remainingCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);

    carbsGrams = Math.round(remainingCalories / 4);
  } else {
    // Modo Porcentaje
    const percentages = profile.macroPercentages || { carbs: 45, protein: 30, fat: 25 };
    const carbsPct = percentages.carbs / 100;
    const proteinPct = percentages.protein / 100;
    const fatPct = percentages.fat / 100;

    carbsGrams = Math.round((targetCalories * carbsPct) / 4);
    proteinGrams = Math.round((targetCalories * proteinPct) / 4);
    fatGrams = Math.round((targetCalories * fatPct) / 9);
  }

  // Calcular porcentajes reales
  const totalMacroCalories = carbsGrams * 4 + proteinGrams * 4 + fatGrams * 9;
  const carbsPercent = totalMacroCalories > 0 ? Math.round(((carbsGrams * 4) / totalMacroCalories) * 100) : 40;
  const proteinPercent = totalMacroCalories > 0 ? Math.round(((proteinGrams * 4) / totalMacroCalories) * 100) : 30;
  const fatPercent = totalMacroCalories > 0 ? Math.round(((fatGrams * 9) / totalMacroCalories) * 100) : 30;

  return {
    targetCalories,
    carbsGrams,
    proteinGrams,
    fatGrams,
    carbsPercent,
    proteinPercent,
    fatPercent,
  };
}

export interface PresetExercise {
  name: string;
  met: number;
  defaultDurationMinutes: number;
  description: string;
}

/**
 * Presets de actividades físicas con sus equivalentes metabólicos (METs)
 * según el Compendio de Actividades Físicas (Ainsworth et al.):
 * - Pesas (Entrenamiento de fuerza moderado-intenso): 5.5 METs
 * - Cardio / HIIT (Intervalos de alta intensidad): 8.5 METs
 * - Caminata 3km/h (Paseo ligero / ~3.2 km/h): 2.8 METs
 * - Running (Trote / carrera continua ~8.5 km/h): 9.0 METs
 * - Pilates (Control postural, mat / reformer): 3.8 METs
 * - Baile (Baile intenso / rave / techno, similar a ciclismo moderado): 7.3 METs
 */
export const EXERCISE_PRESETS: PresetExercise[] = [
  {
    name: "Pesas",
    met: 5.5,
    defaultDurationMinutes: 45,
    description: "Fuerza y musculación",
  },
  {
    name: "Cardio / HIIT",
    met: 8.5,
    defaultDurationMinutes: 30,
    description: "Alta intensidad y circuito",
  },
  {
    name: "Caminata 3km/h",
    met: 2.8,
    defaultDurationMinutes: 45,
    description: "Paseo suave / regenerativo",
  },
  {
    name: "Running",
    met: 9.0,
    defaultDurationMinutes: 30,
    description: "Carrera continua / trote",
  },
  {
    name: "Pilates",
    met: 3.8,
    defaultDurationMinutes: 45,
    description: "Mat o reformer",
  },
  {
    name: "Baile",
    met: 7.3,
    defaultDurationMinutes: 60,
    description: "Baile intenso / techno / rave",
  },
];

/**
 * Calcula el gasto calórico de una actividad física basado en el Compendio de Actividades Físicas (METs) y el peso del usuario.
 * Fórmula: kcal = MET * peso (kg) * (minutos / 60)
 */
export function calculateExerciseCalories(
  met: number,
  weightKg: number,
  durationMinutes: number
): number {
  if (met <= 0 || weightKg <= 0 || durationMinutes <= 0) return 0;
  return Math.round(met * weightKg * (durationMinutes / 60));
}

