"use client";

import { useState, useMemo, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useAuth } from "@/providers/AuthProvider";
import { recipesApi } from "../api/recipesApi";
import type { Recipe, RecipeItem } from "@/types/database";
import type { RecipeFormData, CalculatedRecipeMacros } from "../types";

export function calculateRecipeMacros(
  items: RecipeItem[],
  servings = 1
): CalculatedRecipeMacros {
  const safeServings = Math.max(1, servings || 1);

  const totals = items.reduce(
    (acc, item) => ({
      calories: acc.calories + (item.calories || 0),
      protein: acc.protein + (item.proteinG || 0),
      carbs: acc.carbs + (item.carbsG || 0),
      fat: acc.fat + (item.fatG || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    totalCalories: Math.round(totals.calories),
    totalProteinG: Number(totals.protein.toFixed(1)),
    totalCarbsG: Number(totals.carbs.toFixed(1)),
    totalFatG: Number(totals.fat.toFixed(1)),
    caloriesPerServing: Math.round(totals.calories / safeServings),
    proteinPerServing: Number((totals.protein / safeServings).toFixed(1)),
    carbsPerServing: Number((totals.carbs / safeServings).toFixed(1)),
    fatPerServing: Number((totals.fat / safeServings).toFixed(1)),
  };
}

export function useRecipes() {
  const { userId } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allRecipes = useLiveQuery(async () => {
    return await recipesApi.getRecipes(userId);
  }, [userId]);

  const filteredRecipes = useMemo(() => {
    if (!allRecipes) return [];

    return allRecipes.filter((recipe) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.description && recipe.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = !selectedTag || recipe.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [allRecipes, searchQuery, selectedTag]);

  const allTags = useMemo(() => {
    if (!allRecipes) return [];
    const tagsSet = new Set<string>();
    for (const r of allRecipes) {
      for (const t of r.tags) {
        tagsSet.add(t);
      }
    }
    return Array.from(tagsSet);
  }, [allRecipes]);

  const addRecipe = useCallback(
    async (data: RecipeFormData) => {
      const macros = calculateRecipeMacros(data.items, data.servings);

      const newRecipe: Recipe = {
        id: `recipe-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        userId: userId || "current_user",
        name: data.name,
        description: data.description || "",
        servings: data.servings,
        items: data.items,
        steps: data.steps,
        tags: data.tags,
        imageUrl: data.imageUrl,
        ...macros,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await recipesApi.saveRecipe(newRecipe);
      return newRecipe;
    },
    [userId]
  );

  const updateRecipe = useCallback(
    async (id: string, data: RecipeFormData) => {
      if (!allRecipes) return;
      const existing = allRecipes.find((r) => r.id === id);
      if (!existing) return;

      const macros = calculateRecipeMacros(data.items, data.servings);

      const updated: Recipe = {
        ...existing,
        ...data,
        ...macros,
        userId: userId || existing.userId || "current_user",
        updatedAt: Date.now(),
      };

      await recipesApi.saveRecipe(updated);
    },
    [allRecipes, userId]
  );

  const deleteRecipe = useCallback(
    async (id: string) => {
      await recipesApi.deleteRecipe(id, userId);
    },
    [userId]
  );

  return {
    recipes: filteredRecipes,
    totalCount: allRecipes?.length || 0,
    isLoading: allRecipes === undefined,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    allTags,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    calculateRecipeMacros,
  };
}
