import type { RecipeItem } from "@/types/database";

export interface RecipeFormData {
  name: string;
  description?: string;
  servings: number;
  items: RecipeItem[];
  steps: string[];
  tags: string[];
  imageUrl?: string;
}

export interface CalculatedRecipeMacros {
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
}
