// Definiciones globales de tipos y modelos de datos para Nutria

export interface UserProfile {
  userId: string; // Firebase Auth UID o 'current_user'
  email?: string;
  weightKg: number;
  heightCm: number;
  birthDate: string; // YYYY-MM-DD
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'intense' | 'very_intense';
  goalType: 'fast_loss' | 'moderate_loss' | 'maintenance';
  customDeficitKcal: number; // 100 a 500 kcal
  macroCalculationMode: 'body_weight' | 'percentage';
  proteinGramsPerKg?: number; // Default 2.0
  fatGramsPerKg?: number; // Default 0.9
  macroPercentages?: { carbs: number; protein: number; fat: number };
  selectedTheme: 'matcha-peach' | 'cyber-lilac' | 'warm-otter';
  cycleLengthDays: number; // Default 28 (rango 24-35)
  periodDurationDays: number; // Default 5 (rango 3-7)
  lastPeriodDate?: string; // YYYY-MM-DD fecha de inicio del último período
  createdAt: number;
  updatedAt: number;
}

export type PortionUnit = 'g' | 'ml' | 'unit';

export interface Ingredient {
  id: string;
  userId: string;
  name: string;
  brand?: string;
  portionGrams: number; // Porción estándar (ej. 100g)
  portionUnit: PortionUnit;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  isFavorite: boolean;
  imageUrl?: string; // Imagen WebP comprimida en Base64
  createdAt: number;
  updatedAt: number;
}

export interface RecipeItem {
  ingredientId: string;
  ingredientName: string;
  quantityGrams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface Recipe {
  id: string;
  userId: string;
  name: string;
  description?: string;
  servings: number;
  items: RecipeItem[];
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  steps: string[];
  tags: string[];
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
}

// Inmutabilidad (Snapshot Pattern) para el Diario
export interface LoggedFoodItem {
  id: string;
  ingredientId?: string;
  recipeId?: string;
  name: string;
  quantityGrams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  loggedAt: number;
}

export type MealType = 'breakfast' | 'lunch' | 'snack_afternoon' | 'snack' | 'dinner';

export interface ExerciseEntry {
  id: string;
  name: string;
  durationMinutes: number;
  baseDurationMinutes: number;
  baseCalories: number;
  caloriesBurned: number;
  loggedAt: number;
}

export interface FastingSession {
  id: string; // 'current_fasting'
  userId: string;
  startTime: number; // Timestamp absoluto Date.now()
  targetHours: number; // 16, 14, 12
  isActive: boolean;
  completedAt?: number;
}

export interface DailyLog {
  date: string; // Clave primaria: YYYY-MM-DD en hora local
  userId: string;
  meals: {
    breakfast: LoggedFoodItem[];
    lunch: LoggedFoodItem[];
    snack_afternoon: LoggedFoodItem[];
    snack: LoggedFoodItem[];
    dinner: LoggedFoodItem[];
  };
  exercises: ExerciseEntry[];
  moodScore?: 1 | 2 | 3 | 4 | 5;
  moodNote?: string;
  hasLoveNote: boolean;
  isPeriodStart: boolean;
  isPeriodEnd: boolean;
  isPeriodActive: boolean;
  weightEntryKg?: number;
  fastingDurationMinutes?: number;
  updatedAt: number;
}

export interface AnthropometricEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  waistCm?: number;
  hipCm?: number;
  thighCm?: number;
  armCm?: number;
  chestCm?: number;
  weightKg?: number;
  notes?: string;
  createdAt: number;
}
