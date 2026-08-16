"use client";

import { useState } from "react";
import { Plus, Star, BowlFood } from "@phosphor-icons/react";
import { useFoods } from "@/features/foods";
import {
  FoodItemCard,
  FoodFormModal,
  PortionCalculatorModal,
} from "@/features/foods";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import type { Ingredient } from "@/types/database";
import type { FoodFormData } from "@/features/foods";

export default function AlimentosPage() {
  const {
    foods,
    totalCount,
    isLoading,
    searchQuery,
    setSearchQuery,
    favoritesOnly,
    setFavoritesOnly,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    toggleFavorite,
  } = useFoods();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Ingredient | null>(null);
  const [calculatingFood, setCalculatingFood] = useState<Ingredient | null>(
    null,
  );

  const handleOpenCreate = () => {
    setEditingFood(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (food: Ingredient) => {
    setEditingFood(food);
    setIsFormOpen(true);
  };

  const handleSaveFood = async (data: FoodFormData, existingId?: string) => {
    if (existingId) {
      await updateIngredient(existingId, data);
    } else {
      await addIngredient(data);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6 pb-24">
      {/* Header con Título y Acción de Nuevo Alimento */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-main">
            Inventario de Alimentos
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            {totalCount} alimentos cargados en tu base local con macros por
            porción.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus weight="bold" className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Nuevo Alimento
        </Button>
      </header>

      {/* Barra de Búsqueda y Filtro de Favoritos */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por nombre o marca (ej. Pollo, Avena, Yogur)..."
        />

        <button
          type="button"
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-button text-xs font-semibold border transition-all cursor-pointer select-none ${
            favoritesOnly
              ? "bg-[#F4A261] text-white border-[#E76F51] shadow-xs"
              : "bg-surface text-text-muted border-border hover:bg-surface-hover"
          }`}
        >
          <Star
            weight={favoritesOnly ? "fill" : "regular"}
            className="w-4 h-4"
          />
          <span>Solo Favoritos</span>
        </button>
      </div>

      {/* Listado de Alimentos */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <SkeletonLoader variant="card" count={4} />
        </div>
      ) : foods.length > 0 ? (
        <section
          aria-label="Lista de Alimentos"
          className="flex flex-col gap-2.5"
        >
          {foods.map((food) => (
            <FoodItemCard
              key={food.id}
              food={food}
              onToggleFavorite={toggleFavorite}
              onCalculatePortion={(f) => setCalculatingFood(f)}
              onEdit={(f) => handleOpenEdit(f)}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={<BowlFood weight="duotone" className="w-8 h-8" />}
          title={
            searchQuery || favoritesOnly
              ? "No se encontraron alimentos"
              : "Tu inventario está vacío"
          }
          description={
            searchQuery || favoritesOnly
              ? "Intenta modificar el término de búsqueda o desactivar el filtro de favoritos."
              : "Agrega tus alimentos preferidos para registrar tus comidas en segundos."
          }
          actionText={
            searchQuery || favoritesOnly
              ? "Limpiar Filtros"
              : "Crear Primer Alimento"
          }
          onAction={
            searchQuery || favoritesOnly
              ? () => {
                  setSearchQuery("");
                  setFavoritesOnly(false);
                }
              : handleOpenCreate
          }
        />
      )}

      {/* Modales */}
      <FoodFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveFood}
        onDelete={deleteIngredient}
        editingFood={editingFood}
      />

      <PortionCalculatorModal
        isOpen={Boolean(calculatingFood)}
        onClose={() => setCalculatingFood(null)}
        food={calculatingFood}
      />
    </main>
  );
}
