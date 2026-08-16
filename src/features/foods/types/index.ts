import type { PortionUnit } from "@/types/database";

export interface FoodFormData {
  name: string;
  brand?: string;
  portionGrams: number;
  portionUnit: PortionUnit;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  isFavorite: boolean;
  imageUrl?: string;
}

export interface FoodFilterOptions {
  searchQuery: string;
  favoritesOnly: boolean;
}
