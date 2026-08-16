"use client";

import { useState, useMemo, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useAuth } from "@/providers/AuthProvider";
import { foodsApi } from "../api/foodsApi";
import type { Ingredient } from "@/types/database";
import type { FoodFormData } from "../types";

export function useFoods() {
  const { userId } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Consulta reactiva en vivo
  const allFoods = useLiveQuery(async () => {
    return await foodsApi.getIngredients(userId);
  }, [userId]);

  // Filtrado y ordenamiento (Favoritos ⭐ arriba de todo)
  const filteredFoods = useMemo(() => {
    if (!allFoods) return [];

    return allFoods
      .filter((food) => {
        const matchesSearch =
          searchQuery.trim() === "" ||
          food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (food.brand && food.brand.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFavorite = !favoritesOnly || food.isFavorite;

        return matchesSearch && matchesFavorite;
      })
      .sort((a, b) => {
        // Favoritos primero
        if (a.isFavorite !== b.isFavorite) {
          return a.isFavorite ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
  }, [allFoods, searchQuery, favoritesOnly]);

  const addIngredient = useCallback(
    async (data: FoodFormData) => {
      const newIngredient: Ingredient = {
        ...data,
        id: `food-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        userId: userId || "current_user",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await foodsApi.saveIngredient(newIngredient);
      return newIngredient;
    },
    [userId]
  );

  const updateIngredient = useCallback(
    async (id: string, data: Partial<FoodFormData>) => {
      if (!allFoods) return;
      const existing = allFoods.find((item) => item.id === id);
      if (!existing) return;

      const updated: Ingredient = {
        ...existing,
        ...data,
        userId: userId || existing.userId || "current_user",
        updatedAt: Date.now(),
      };

      await foodsApi.saveIngredient(updated);
    },
    [allFoods, userId]
  );

  const deleteIngredient = useCallback(
    async (id: string) => {
      await foodsApi.deleteIngredient(id, userId);
    },
    [userId]
  );

  const toggleFavorite = useCallback(
    async (id: string, currentStatus: boolean) => {
      await foodsApi.toggleFavorite(id, !currentStatus, userId);
    },
    [userId]
  );

  return {
    foods: filteredFoods,
    totalCount: allFoods?.length || 0,
    isLoading: allFoods === undefined,
    searchQuery,
    setSearchQuery,
    favoritesOnly,
    setFavoritesOnly,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    toggleFavorite,
  };
}
