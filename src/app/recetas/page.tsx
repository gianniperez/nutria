"use client";

import { useState } from "react";
import { Plus, CookingPot } from "@phosphor-icons/react";
import { useRecipes } from "@/features/recipes";
import {
  RecipeCard,
  RecipeFormModal,
  RecipeDetailModal,
} from "@/features/recipes";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import type { Recipe } from "@/types/database";
import type { RecipeFormData } from "@/features/recipes";

export default function RecetasPage() {
  const {
    recipes,
    totalCount,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    allTags,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  } = useRecipes();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  const handleOpenCreate = () => {
    setEditingRecipe(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  const handleSaveRecipe = async (
    data: RecipeFormData,
    existingId?: string,
  ) => {
    if (existingId) {
      await updateRecipe(existingId, data);
    } else {
      await addRecipe(data);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6 pb-24">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-main">
            Recetas
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            {totalCount} recetas calculadas con porciones y macros consolidados.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus weight="bold" className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Nueva Receta
        </Button>
      </header>

      {/* Búsqueda y Filtros de Tags */}
      <div className="flex flex-col gap-2.5">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar receta (ej. Tarta de Verduras, Panqueques)..."
        />

        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer select-none shrink-0 ${
                selectedTag === null
                  ? "bg-primary text-primary-text font-semibold border-primary-dark shadow-2xs"
                  : "bg-surface text-text-muted border-border hover:bg-surface-hover"
              }`}
            >
              Todos
            </button>

            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer select-none shrink-0 ${
                  selectedTag === tag
                    ? "bg-primary text-primary-text font-semibold border-primary-dark shadow-2xs"
                    : "bg-surface text-text-muted border-border hover:bg-surface-hover"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Listado de Recetas */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <SkeletonLoader variant="card" count={3} />
        </div>
      ) : recipes.length > 0 ? (
        <section aria-label="Lista de Recetas" className="flex flex-col gap-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onView={(r) => setViewingRecipe(r)}
              onEdit={(r) => handleOpenEdit(r)}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={<CookingPot weight="duotone" className="w-8 h-8" />}
          title={
            searchQuery || selectedTag
              ? "No se encontraron recetas"
              : "Aún no tienes recetas creadas"
          }
          description={
            searchQuery || selectedTag
              ? "Prueba cambiando el término de búsqueda o seleccionando otra etiqueta."
              : "Crea tu primera receta para calcular automáticamente las porciones y macros exactos."
          }
          actionText={
            searchQuery || selectedTag
              ? "Limpiar Filtros"
              : "Crear Primera Receta"
          }
          onAction={
            searchQuery || selectedTag
              ? () => {
                  setSearchQuery("");
                  setSelectedTag(null);
                }
              : handleOpenCreate
          }
        />
      )}

      {/* Modales */}
      <RecipeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveRecipe}
        onDelete={deleteRecipe}
        editingRecipe={editingRecipe}
      />

      <RecipeDetailModal
        isOpen={Boolean(viewingRecipe)}
        onClose={() => setViewingRecipe(null)}
        recipe={viewingRecipe}
      />
    </main>
  );
}
