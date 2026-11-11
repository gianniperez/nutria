"use client";

import { useState } from "react";
import {
  BowlFood,
  CookingPot,
  Plus,
  Minus,
  Star,
  Check,
  Trash,
} from "@phosphor-icons/react";
import { Modal } from "@/components/Modal";
import { SearchInput } from "@/components/SearchInput";
import { SegmentedControl } from "@/components/SegmentedControl";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { useFoods } from "@/features/foods";
import { useRecipes } from "@/features/recipes";
import type { MealType, Ingredient, Recipe } from "@/types/database";
import type { StagedMealItem } from "../../types";

interface AddFoodToMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealType | null;
  mealTitle: string;
  onLogFood?: (
    mealType: MealType,
    food: Ingredient,
    quantityGrams: number,
  ) => Promise<void>;
  onLogRecipe?: (
    mealType: MealType,
    recipe: Recipe,
    servings: number,
  ) => Promise<void>;
  onLogMultiple?: (
    mealType: MealType,
    items: StagedMealItem[],
  ) => Promise<void>;
}

export function AddFoodToMealModal({
  isOpen,
  onClose,
  mealType,
  mealTitle,
  onLogFood,
  onLogRecipe,
  onLogMultiple,
}: AddFoodToMealModalProps) {
  const [activeTab, setActiveTab] = useState<"foods" | "recipes">("foods");
  const [search, setSearch] = useState("");
  const [stagedItems, setStagedItems] = useState<StagedMealItem[]>([]);
  const [isLogging, setIsLogging] = useState(false);

  const { foods } = useFoods();
  const { recipes } = useRecipes();

  if (!mealType || !isOpen) return null;

  const filteredFoods = foods.filter(
    (f) =>
      search.trim() === "" ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      (f.brand && f.brand.toLowerCase().includes(search.toLowerCase())),
  );

  const filteredRecipes = recipes.filter(
    (r) =>
      search.trim() === "" ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description &&
        r.description.toLowerCase().includes(search.toLowerCase())),
  );

  // Totales acumulados en la bandeja
  const totalStagedCalories = stagedItems.reduce(
    (acc, item) => acc + item.calories,
    0,
  );
  const totalStagedProtein = stagedItems.reduce(
    (acc, item) => acc + item.proteinG,
    0,
  );

  // 1-Tap para agregar o incrementar alimento
  const handleToggleOrAddFood = (food: Ingredient) => {
    const existingIndex = stagedItems.findIndex(
      (item) => item.food?.id === food.id,
    );

    if (existingIndex >= 0) {
      const existing = stagedItems[existingIndex];
      const step =
        food.portionUnit === "unit" ? 1 : food.portionGrams || 50;
      handleUpdateQuantity(existing.tempId, existing.quantity + step);
    } else {
      const defaultQty =
        food.portionUnit === "unit" ? 1 : food.portionGrams || 100;
      const basePortion = food.portionGrams || 100;
      const factor = defaultQty / basePortion;

      const newItem: StagedMealItem = {
        tempId: `staged-food-${food.id}-${Date.now()}`,
        type: "food",
        food,
        name: food.name,
        quantity: defaultQty,
        unit: food.portionUnit,
        calories: Math.round(food.calories * factor),
        proteinG: Number((food.proteinG * factor).toFixed(1)),
        carbsG: Number((food.carbsG * factor).toFixed(1)),
        fatG: Number((food.fatG * factor).toFixed(1)),
      };

      setStagedItems((prev) => [...prev, newItem]);
    }
  };

  // 1-Tap para agregar o incrementar receta
  const handleToggleOrAddRecipe = (recipe: Recipe) => {
    const existingIndex = stagedItems.findIndex(
      (item) => item.recipe?.id === recipe.id,
    );

    if (existingIndex >= 0) {
      const existing = stagedItems[existingIndex];
      handleUpdateQuantity(existing.tempId, existing.quantity + 1);
    } else {
      const newItem: StagedMealItem = {
        tempId: `staged-recipe-${recipe.id}-${Date.now()}`,
        type: "recipe",
        recipe,
        name: `1 porción de ${recipe.name}`,
        quantity: 1,
        unit: "porción",
        calories: Math.round(recipe.caloriesPerServing),
        proteinG: Number(recipe.proteinPerServing.toFixed(1)),
        carbsG: Number(recipe.carbsPerServing.toFixed(1)),
        fatG: Number(recipe.fatPerServing.toFixed(1)),
      };

      setStagedItems((prev) => [...prev, newItem]);
    }
  };

  // Modificar cantidad en línea en la bandeja
  const handleUpdateQuantity = (tempId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveStagedItem(tempId);
      return;
    }

    setStagedItems((prev) =>
      prev.map((item) => {
        if (item.tempId !== tempId) return item;

        if (item.type === "food" && item.food) {
          const basePortion = item.food.portionGrams || 100;
          const factor = newQty / basePortion;
          return {
            ...item,
            quantity: newQty,
            calories: Math.round(item.food.calories * factor),
            proteinG: Number((item.food.proteinG * factor).toFixed(1)),
            carbsG: Number((item.food.carbsG * factor).toFixed(1)),
            fatG: Number((item.food.fatG * factor).toFixed(1)),
          };
        }

        if (item.type === "recipe" && item.recipe) {
          return {
            ...item,
            name:
              newQty === 1
                ? `1 porción de ${item.recipe.name}`
                : `${newQty} porciones de ${item.recipe.name}`,
            quantity: newQty,
            unit: newQty === 1 ? "porción" : "porciones",
            calories: Math.round(item.recipe.caloriesPerServing * newQty),
            proteinG: Number((item.recipe.proteinPerServing * newQty).toFixed(1)),
            carbsG: Number((item.recipe.carbsPerServing * newQty).toFixed(1)),
            fatG: Number((item.recipe.fatPerServing * newQty).toFixed(1)),
          };
        }

        return item;
      }),
    );
  };

  const handleRemoveStagedItem = (tempId: string) => {
    setStagedItems((prev) => prev.filter((item) => item.tempId !== tempId));
  };

  // Confirmar y registrar todo el lote
  const handleConfirmBatchLog = async () => {
    if (stagedItems.length === 0) return;

    setIsLogging(true);
    try {
      if (onLogMultiple) {
        await onLogMultiple(mealType, stagedItems);
      } else {
        for (const item of stagedItems) {
          if (item.type === "food" && item.food && onLogFood) {
            await onLogFood(mealType, item.food, item.quantity);
          } else if (item.type === "recipe" && item.recipe && onLogRecipe) {
            await onLogRecipe(mealType, item.recipe, item.quantity);
          }
        }
      }
      setStagedItems([]);
      onClose();
    } finally {
      setIsLogging(false);
    }
  };

  const handleModalClose = () => {
    setStagedItems([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={`Agregar a ${mealTitle}`}
      description="Presiona sobre cualquier alimento para sumarlo directamente a tu comida."
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={handleModalClose}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={stagedItems.length === 0}
            isLoading={isLogging}
            onClick={handleConfirmBatchLog}
          >
            {stagedItems.length > 0
              ? `Agregar seleccionados (${stagedItems.length}) — ${totalStagedCalories} kcal`
              : "Selecciona alimentos"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3.5">
        {/* Bandeja de Alimentos Preparados (Staged Items) */}
        {stagedItems.length > 0 && (
          <div className="p-3 bg-surface-hover/80 border border-primary/30 rounded-card flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-text-main flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary inline-block animate-pulse"></span>
                Alimentos a registrar ({stagedItems.length})
              </span>
              <span className="text-xs font-bold text-primary-text">
                {totalStagedCalories} kcal{" "}
                {totalStagedProtein > 0
                  ? `· ${Math.round(totalStagedProtein)}g prot`
                  : ""}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
              {stagedItems.map((item) => {
                const step =
                  item.type === "recipe" || item.unit === "unit"
                    ? 1
                    : (item.food?.portionGrams && item.food.portionGrams < 50
                        ? item.food.portionGrams
                        : 25);

                return (
                  <div
                    key={item.tempId}
                    className="flex items-center justify-between p-2 bg-surface border border-border/80 rounded-button text-xs shadow-2xs gap-2"
                  >
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-semibold text-text-main truncate">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        {item.calories} kcal · {item.proteinG}g P · {item.carbsG}g C · {item.fatG}g G
                      </span>
                    </div>

                    {/* Controles de Cantidad en Línea */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center border border-border rounded-button bg-surface-hover">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.tempId, item.quantity - step)}
                          className="px-2 py-1 text-text-muted hover:text-text-main hover:bg-surface rounded-l-button transition-colors cursor-pointer"
                          title="Restar cantidad"
                        >
                          <Minus weight="bold" className="w-3 h-3" />
                        </button>

                        <span className="px-2 text-xs font-bold text-text-main min-w-[50px] text-center select-none">
                          {item.quantity} {item.unit}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.tempId, item.quantity + step)}
                          className="px-2 py-1 text-text-muted hover:text-text-main hover:bg-surface rounded-r-button transition-colors cursor-pointer"
                          title="Sumar cantidad"
                        >
                          <Plus weight="bold" className="w-3 h-3" />
                        </button>
                      </div>

                      <IconButton
                        icon={<Trash weight="bold" className="w-3.5 h-3.5 text-text-muted hover:text-menstrual" />}
                        aria-label="Quitar de la lista"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveStagedItem(item.tempId)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selector de Pestaña: Alimentos vs Recetas */}
        <SegmentedControl
          name="add-food-tab"
          options={[
            {
              value: "foods",
              label: `Alimentos (${foods.length})`,
              icon: <BowlFood weight="duotone" className="w-4 h-4" />,
            },
            {
              value: "recipes",
              label: `Recetas (${recipes.length})`,
              icon: <CookingPot weight="duotone" className="w-4 h-4" />,
            },
          ]}
          value={activeTab}
          onChange={(val) => setActiveTab(val)}
        />

        {/* Barra de Búsqueda */}
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={
            activeTab === "foods"
              ? "Buscar alimento (ej. Pollo, Avena)..."
              : "Buscar receta (ej. Tarta, Panqueques)..."
          }
        />

        {/* Lista de Resultados con 1-Tap Add */}
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
          {activeTab === "foods" ? (
            filteredFoods.length > 0 ? (
              filteredFoods.map((food) => {
                const stagedItem = stagedItems.find(
                  (item) => item.food?.id === food.id,
                );

                return (
                  <div
                    key={food.id}
                    onClick={() => handleToggleOrAddFood(food)}
                    className={`flex items-center justify-between p-2.5 rounded-card border transition-all cursor-pointer select-none ${
                      stagedItem
                        ? "bg-primary-light/40 border-primary ring-1 ring-primary/40 shadow-2xs"
                        : "bg-surface border-border hover:bg-surface-hover"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {food.isFavorite && (
                        <Star
                          weight="fill"
                          className="w-3.5 h-3.5 text-accent shrink-0"
                        />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-xs sm:text-sm text-text-main truncate">
                          {food.name}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          {food.portionGrams}
                          {food.portionUnit} — {food.calories} kcal (P:{" "}
                          {food.proteinG}g | C: {food.carbsG}g | G: {food.fatG}g)
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant={stagedItem ? "primary" : "outline"}
                      size="sm"
                      leftIcon={
                        stagedItem ? (
                          <Check weight="bold" className="w-3 h-3" />
                        ) : (
                          <Plus weight="bold" className="w-3 h-3" />
                        )
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleOrAddFood(food);
                      }}
                    >
                      {stagedItem ? `${stagedItem.quantity} ${stagedItem.unit}` : "Elegir"}
                    </Button>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-text-muted text-center py-6">
                No se encontraron alimentos en tu inventario.
              </p>
            )
          ) : filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => {
              const stagedItem = stagedItems.find(
                (item) => item.recipe?.id === recipe.id,
              );

              return (
                <div
                  key={recipe.id}
                  onClick={() => handleToggleOrAddRecipe(recipe)}
                  className={`flex items-center justify-between p-2.5 rounded-card border transition-all cursor-pointer select-none ${
                    stagedItem
                      ? "bg-primary-light/40 border-primary ring-1 ring-primary/40 shadow-2xs"
                      : "bg-surface border-border hover:bg-surface-hover"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <CookingPot
                      weight="duotone"
                      className="w-4 h-4 text-primary shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-xs sm:text-sm text-text-main truncate">
                        {recipe.name}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        Porción: {recipe.caloriesPerServing} kcal (P:{" "}
                        {recipe.proteinPerServing}g | C:{" "}
                        {recipe.carbsPerServing}g | G: {recipe.fatPerServing}g)
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant={stagedItem ? "primary" : "outline"}
                    size="sm"
                    leftIcon={
                      stagedItem ? (
                        <Check weight="bold" className="w-3 h-3" />
                      ) : (
                        <Plus weight="bold" className="w-3 h-3" />
                      )
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleOrAddRecipe(recipe);
                    }}
                  >
                    {stagedItem
                      ? `${stagedItem.quantity} ${stagedItem.quantity === 1 ? "porc." : "porcs."}`
                      : "Elegir"}
                  </Button>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-text-muted text-center py-6">
              No tienes recetas guardadas aún.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
