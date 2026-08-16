"use client";

import { useState } from "react";
import {
  BowlFood,
  CookingPot,
  Plus,
  Star,
  Check,
  PencilSimple,
  X,
} from "@phosphor-icons/react";
import { Modal } from "@/components/Modal";
import { SearchInput } from "@/components/SearchInput";
import { SegmentedControl } from "@/components/SegmentedControl";
import { NumberInput } from "@/components/NumberInput";
import { Button } from "@/components/Button";
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

  // Lista de items preparados para agregar en lote
  const [stagedItems, setStagedItems] = useState<StagedMealItem[]>([]);

  // Item activo siendo configurado
  const [activeFood, setActiveFood] = useState<Ingredient | null>(null);
  const [foodGrams, setFoodGrams] = useState(100);

  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [recipeServings, setRecipeServings] = useState(1);

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

  const handleSelectFood = (food: Ingredient) => {
    setActiveRecipe(null);
    setActiveFood(food);
    const existing = stagedItems.find((item) => item.food?.id === food.id);
    setFoodGrams(existing ? existing.quantity : food.portionGrams || 100);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setActiveFood(null);
    setActiveRecipe(recipe);
    const existing = stagedItems.find((item) => item.recipe?.id === recipe.id);
    setRecipeServings(existing ? existing.quantity : 1);
  };

  const handleAddOrUpdateFoodStaged = () => {
    if (!activeFood) return;
    const basePortion = activeFood.portionGrams || 100;
    const factor = foodGrams / basePortion;

    const stagedItem: StagedMealItem = {
      tempId: `staged-food-${activeFood.id}`,
      type: "food",
      food: activeFood,
      name: activeFood.name,
      quantity: foodGrams,
      unit: activeFood.portionUnit,
      calories: Math.round(activeFood.calories * factor),
      proteinG: Number((activeFood.proteinG * factor).toFixed(1)),
      carbsG: Number((activeFood.carbsG * factor).toFixed(1)),
      fatG: Number((activeFood.fatG * factor).toFixed(1)),
    };

    setStagedItems((prev) => {
      const idx = prev.findIndex((item) => item.food?.id === activeFood.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = stagedItem;
        return next;
      }
      return [...prev, stagedItem];
    });

    setActiveFood(null);
  };

  const handleAddOrUpdateRecipeStaged = () => {
    if (!activeRecipe) return;
    const servingLabel =
      recipeServings === 1
        ? `1 porción de ${activeRecipe.name}`
        : `${recipeServings} porciones de ${activeRecipe.name}`;

    const stagedItem: StagedMealItem = {
      tempId: `staged-recipe-${activeRecipe.id}`,
      type: "recipe",
      recipe: activeRecipe,
      name: servingLabel,
      quantity: recipeServings,
      unit: recipeServings === 1 ? "porción" : "porciones",
      calories: Math.round(activeRecipe.caloriesPerServing * recipeServings),
      proteinG: Number(
        (activeRecipe.proteinPerServing * recipeServings).toFixed(1),
      ),
      carbsG: Number(
        (activeRecipe.carbsPerServing * recipeServings).toFixed(1),
      ),
      fatG: Number((activeRecipe.fatPerServing * recipeServings).toFixed(1)),
    };

    setStagedItems((prev) => {
      const idx = prev.findIndex((item) => item.recipe?.id === activeRecipe.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = stagedItem;
        return next;
      }
      return [...prev, stagedItem];
    });

    setActiveRecipe(null);
  };

  const handleRemoveStagedItem = (tempId: string) => {
    setStagedItems((prev) => prev.filter((item) => item.tempId !== tempId));
  };

  const handleConfirmBatchLog = async () => {
    const finalItems = [...stagedItems];

    if (activeFood) {
      const basePortion = activeFood.portionGrams || 100;
      const factor = foodGrams / basePortion;
      const staged: StagedMealItem = {
        tempId: `staged-food-${activeFood.id}`,
        type: "food",
        food: activeFood,
        name: activeFood.name,
        quantity: foodGrams,
        unit: activeFood.portionUnit,
        calories: Math.round(activeFood.calories * factor),
        proteinG: Number((activeFood.proteinG * factor).toFixed(1)),
        carbsG: Number((activeFood.carbsG * factor).toFixed(1)),
        fatG: Number((activeFood.fatG * factor).toFixed(1)),
      };
      const idx = finalItems.findIndex(
        (item) => item.food?.id === activeFood.id,
      );
      if (idx >= 0) finalItems[idx] = staged;
      else finalItems.push(staged);
    } else if (activeRecipe) {
      const servingLabel =
        recipeServings === 1
          ? `1 porción de ${activeRecipe.name}`
          : `${recipeServings} porciones de ${activeRecipe.name}`;
      const staged: StagedMealItem = {
        tempId: `staged-recipe-${activeRecipe.id}`,
        type: "recipe",
        recipe: activeRecipe,
        name: servingLabel,
        quantity: recipeServings,
        unit: recipeServings === 1 ? "porción" : "porciones",
        calories: Math.round(activeRecipe.caloriesPerServing * recipeServings),
        proteinG: Number(
          (activeRecipe.proteinPerServing * recipeServings).toFixed(1),
        ),
        carbsG: Number(
          (activeRecipe.carbsPerServing * recipeServings).toFixed(1),
        ),
        fatG: Number((activeRecipe.fatPerServing * recipeServings).toFixed(1)),
      };
      const idx = finalItems.findIndex(
        (item) => item.recipe?.id === activeRecipe.id,
      );
      if (idx >= 0) finalItems[idx] = staged;
      else finalItems.push(staged);
    }

    if (finalItems.length === 0) return;

    setIsLogging(true);
    try {
      if (onLogMultiple) {
        await onLogMultiple(mealType, finalItems);
      } else {
        for (const item of finalItems) {
          if (item.type === "food" && item.food && onLogFood) {
            await onLogFood(mealType, item.food, item.quantity);
          } else if (item.type === "recipe" && item.recipe && onLogRecipe) {
            await onLogRecipe(mealType, item.recipe, item.quantity);
          }
        }
      }
      setStagedItems([]);
      setActiveFood(null);
      setActiveRecipe(null);
      onClose();
    } finally {
      setIsLogging(false);
    }
  };

  const handleModalClose = () => {
    setStagedItems([]);
    setActiveFood(null);
    setActiveRecipe(null);
    onClose();
  };

  const currentFoodCalculatedCalories = activeFood
    ? Math.round(
        (activeFood.calories * foodGrams) / (activeFood.portionGrams || 100),
      )
    : 0;

  const currentRecipeCalculatedCalories = activeRecipe
    ? Math.round(activeRecipe.caloriesPerServing * recipeServings)
    : 0;

  const hasItemsToLog =
    stagedItems.length > 0 || Boolean(activeFood) || Boolean(activeRecipe);

  const totalCalculatedCalories =
    totalStagedCalories +
    (activeFood && !stagedItems.some((i) => i.food?.id === activeFood.id)
      ? currentFoodCalculatedCalories
      : 0) +
    (activeRecipe && !stagedItems.some((i) => i.recipe?.id === activeRecipe.id)
      ? currentRecipeCalculatedCalories
      : 0);

  const totalCount =
    stagedItems.length +
    (activeFood && !stagedItems.some((i) => i.food?.id === activeFood.id)
      ? 1
      : 0) +
    (activeRecipe && !stagedItems.some((i) => i.recipe?.id === activeRecipe.id)
      ? 1
      : 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={`Agregar a ${mealTitle}`}
      description="Selecciona alimentos o porciones de tus recetas. Puedes elegir varios antes de guardar."
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={handleModalClose}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={!hasItemsToLog}
            isLoading={isLogging}
            onClick={handleConfirmBatchLog}
          >
            {totalCount > 0
              ? `Agregar seleccionados (${totalCount}) — ${totalCalculatedCalories} kcal`
              : "Selecciona alimentos"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Bandeja de Alimentos Seleccionados (Staged Items) */}
        {stagedItems.length > 0 && (
          <div className="p-3 bg-surface-hover/70 border border-primary/30 rounded-card flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-text-main flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                Alimentos seleccionados ({stagedItems.length})
              </span>
              <span className="text-xs font-semibold text-primary-text">
                {totalStagedCalories} kcal{" "}
                {totalStagedProtein > 0
                  ? `(${Math.round(totalStagedProtein)}g prot)`
                  : ""}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {stagedItems.map((item) => (
                <div
                  key={item.tempId}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-surface border border-border/80 rounded-button text-xs shadow-2xs"
                >
                  <span className="font-semibold text-text-main max-w-[130px] truncate">
                    {item.name}
                  </span>
                  <span className="text-text-muted">
                    {item.quantity}
                    {item.unit} ({item.calories} kcal)
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (item.type === "food" && item.food)
                        handleSelectFood(item.food);
                      if (item.type === "recipe" && item.recipe)
                        handleSelectRecipe(item.recipe);
                    }}
                    className="p-0.5 text-text-muted hover:text-primary transition-colors cursor-pointer"
                    title="Modificar porción"
                  >
                    <PencilSimple weight="bold" className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveStagedItem(item.tempId)}
                    className="p-0.5 text-text-muted hover:text-menstrual transition-colors cursor-pointer"
                    title="Quitar de la lista"
                  >
                    <X weight="bold" className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Panel de Configuración de Porción Activa */}
        {activeFood && (
          <div className="p-3.5 bg-primary-light/30 border border-primary/50 rounded-card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-semibold text-xs text-primary-text">
                  Ajustar cantidad: <strong>{activeFood.name}</strong>
                </span>
                <span className="text-[11px] text-text-muted">
                  {currentFoodCalculatedCalories} kcal (P:{" "}
                  {Number(
                    (
                      (activeFood.proteinG * foodGrams) /
                      (activeFood.portionGrams || 100)
                    ).toFixed(1),
                  )}
                  g | C:{" "}
                  {Number(
                    (
                      (activeFood.carbsG * foodGrams) /
                      (activeFood.portionGrams || 100)
                    ).toFixed(1),
                  )}
                  g | G:{" "}
                  {Number(
                    (
                      (activeFood.fatG * foodGrams) /
                      (activeFood.portionGrams || 100)
                    ).toFixed(1),
                  )}
                  g)
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveFood(null)}
                className="text-[11px] text-text-muted hover:text-text-main underline cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            <NumberInput
              label={`Gramos / ${activeFood.portionUnit}`}
              value={foodGrams}
              onChange={setFoodGrams}
              min={1}
              max={2500}
              step={10}
              unit={activeFood.portionUnit}
            />

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="primary"
                size="sm"
                leftIcon={<Plus weight="bold" className="w-3 h-3" />}
                onClick={handleAddOrUpdateFoodStaged}
              >
                {stagedItems.some((i) => i.food?.id === activeFood.id)
                  ? "Actualizar en la lista"
                  : `Sumar a la selección (+${currentFoodCalculatedCalories} kcal)`}
              </Button>
            </div>
          </div>
        )}

        {activeRecipe && (
          <div className="p-3.5 bg-secondary-light/30 border border-secondary/50 rounded-card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-semibold text-xs text-secondary-text">
                  Ajustar porciones: <strong>{activeRecipe.name}</strong>
                </span>
                <span className="text-[11px] text-text-muted">
                  {currentRecipeCalculatedCalories} kcal (P:{" "}
                  {Number(
                    (activeRecipe.proteinPerServing * recipeServings).toFixed(
                      1,
                    ),
                  )}
                  g | C:{" "}
                  {Number(
                    (activeRecipe.carbsPerServing * recipeServings).toFixed(1),
                  )}
                  g | G:{" "}
                  {Number(
                    (activeRecipe.fatPerServing * recipeServings).toFixed(1),
                  )}
                  g)
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveRecipe(null)}
                className="text-[11px] text-text-muted hover:text-text-main underline cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            <NumberInput
              label="Porciones a consumir"
              value={recipeServings}
              onChange={setRecipeServings}
              min={0.5}
              max={10}
              step={0.5}
              unit="porc."
            />

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={<Plus weight="bold" className="w-3 h-3" />}
                onClick={handleAddOrUpdateRecipeStaged}
              >
                {stagedItems.some((i) => i.recipe?.id === activeRecipe.id)
                  ? "Actualizar en la lista"
                  : `Sumar a la selección (+${currentRecipeCalculatedCalories} kcal)`}
              </Button>
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
          onChange={(val) => {
            setActiveTab(val);
          }}
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

        {/* Lista de Resultados */}
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {activeTab === "foods" ? (
            filteredFoods.length > 0 ? (
              filteredFoods.map((food) => {
                const stagedItem = stagedItems.find(
                  (item) => item.food?.id === food.id,
                );
                const isConfiguring = activeFood?.id === food.id;

                return (
                  <div
                    key={food.id}
                    onClick={() => handleSelectFood(food)}
                    className={`flex items-center justify-between p-2.5 rounded-card border transition-all cursor-pointer select-none ${
                      isConfiguring
                        ? "bg-primary-light/40 border-primary ring-1 ring-primary shadow-2xs"
                        : stagedItem
                          ? "bg-surface-hover/80 border-primary/40"
                          : "bg-surface border-border hover:bg-surface-hover"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {food.isFavorite && (
                        <Star
                          weight="fill"
                          className="w-3.5 h-3.5 text-[#F4A261] shrink-0"
                        />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-xs sm:text-sm text-text-main truncate">
                          {food.name}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          {food.portionGrams}
                          {food.portionUnit} — {food.calories} kcal (P:{" "}
                          {food.proteinG}g | C: {food.carbsG}g | G: {food.fatG}
                          g)
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant={
                        stagedItem
                          ? "primary"
                          : isConfiguring
                            ? "primary"
                            : "outline"
                      }
                      size="sm"
                      leftIcon={
                        stagedItem ? (
                          <Check weight="bold" className="w-3 h-3" />
                        ) : (
                          <Plus weight="bold" className="w-3 h-3" />
                        )
                      }
                    >
                      {stagedItem
                        ? `${stagedItem.quantity}${stagedItem.unit}`
                        : isConfiguring
                          ? "Ajustando"
                          : "Elegir"}
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
              const isConfiguring = activeRecipe?.id === recipe.id;

              return (
                <div
                  key={recipe.id}
                  onClick={() => handleSelectRecipe(recipe)}
                  className={`flex items-center justify-between p-2.5 rounded-card border transition-all cursor-pointer select-none ${
                    isConfiguring
                      ? "bg-secondary-light/40 border-secondary ring-1 ring-secondary shadow-2xs"
                      : stagedItem
                        ? "bg-surface-hover/80 border-secondary/40"
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
                        Por porción: {recipe.caloriesPerServing} kcal (P:{" "}
                        {recipe.proteinPerServing}g | C:{" "}
                        {recipe.carbsPerServing}g | G: {recipe.fatPerServing}g)
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant={
                      stagedItem
                        ? "secondary"
                        : isConfiguring
                          ? "secondary"
                          : "outline"
                    }
                    size="sm"
                    leftIcon={
                      stagedItem ? (
                        <Check weight="bold" className="w-3 h-3" />
                      ) : (
                        <Plus weight="bold" className="w-3 h-3" />
                      )
                    }
                  >
                    {stagedItem
                      ? `${stagedItem.quantity} ${stagedItem.quantity === 1 ? "porc." : "porcs."}`
                      : isConfiguring
                        ? "Ajustando"
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
