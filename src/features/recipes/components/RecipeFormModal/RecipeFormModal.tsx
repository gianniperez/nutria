"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Trash, Plus, ImageSquare } from "@phosphor-icons/react";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { NumberInput } from "@/components/NumberInput";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { MacroNutrientPill } from "@/components/MacroNutrientPill";
import { ConfirmModal } from "@/components/ConfirmModal";
import { compressImageToWebP } from "@/utils/imageCompression";
import { useFoods } from "@/features/foods";
import { calculateRecipeMacros } from "../../hooks/useRecipes";
import type { Recipe, RecipeItem } from "@/types/database";
import type { RecipeFormData } from "../../types";

interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RecipeFormData, existingId?: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  editingRecipe?: Recipe | null;
}

const DEFAULT_FORM: RecipeFormData = {
  name: "",
  description: "",
  servings: 2,
  items: [],
  steps: [""],
  tags: [],
  imageUrl: "",
};

export function RecipeFormModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingRecipe,
}: RecipeFormModalProps) {
  const { foods } = useFoods();
  const [formData, setFormData] = useState<RecipeFormData>(DEFAULT_FORM);
  const [tagInput, setTagInput] = useState("");
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [ingredientGrams, setIngredientGrams] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingRecipe) {
      setFormData({
        name: editingRecipe.name,
        description: editingRecipe.description || "",
        servings: editingRecipe.servings || 2,
        items: editingRecipe.items || [],
        steps: editingRecipe.steps?.length ? editingRecipe.steps : [""],
        tags: editingRecipe.tags || [],
        imageUrl: editingRecipe.imageUrl || "",
      });
      setTagInput(editingRecipe.tags?.join(", ") || "");
    } else {
      setFormData(DEFAULT_FORM);
      setTagInput("");
    }
  }, [editingRecipe, isOpen]);

  // Cálculos en vivo
  const calculatedMacros = calculateRecipeMacros(formData.items, formData.servings);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const compressed = await compressImageToWebP(file, 400, 0.82);
      setFormData((prev) => ({ ...prev, imageUrl: compressed }));
    } catch (err) {
      console.error("Error comprimiendo imagen:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const selectedFood = foods.find((f) => f.id === selectedIngredientId);

  const handleIngredientSelectChange = (id: string) => {
    setSelectedIngredientId(id);
    const food = foods.find((f) => f.id === id);
    if (food) {
      setIngredientGrams(food.portionGrams || (food.portionUnit === "unit" ? 1 : 100));
    }
  };

  const handleAddIngredient = () => {
    if (!selectedIngredientId || !selectedFood) return;

    const basePortion = selectedFood.portionGrams || 100;
    const factor = ingredientGrams / basePortion;

    const newItem: RecipeItem = {
      ingredientId: selectedFood.id,
      ingredientName: selectedFood.name,
      quantityGrams: ingredientGrams,
      calories: Math.round(selectedFood.calories * factor),
      proteinG: Number((selectedFood.proteinG * factor).toFixed(1)),
      carbsG: Number((selectedFood.carbsG * factor).toFixed(1)),
      fatG: Number((selectedFood.fatG * factor).toFixed(1)),
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setSelectedIngredientId("");
    setIngredientGrams(100);
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleStepChange = (index: number, val: string) => {
    setFormData((prev) => {
      const newSteps = [...prev.steps];
      newSteps[index] = val;
      return { ...prev, steps: newSteps };
    });
  };

  const handleAddStep = () => {
    setFormData((prev) => ({ ...prev, steps: [...prev.steps, ""] }));
  };

  const handleRemoveStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const parsedTags = tagInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const cleanSteps = formData.steps.filter((s) => s.trim().length > 0);

    setIsSubmitting(true);
    try {
      await onSave(
        {
          ...formData,
          tags: parsedTags,
          steps: cleanSteps,
        },
        editingRecipe?.id
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (editingRecipe && onDelete) {
      await onDelete(editingRecipe.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={editingRecipe ? "Editar Receta" : "Nueva Receta"}
        description="Agrega ingredientes y calcularemos automáticamente los macros por porción."
        maxWidth="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            {editingRecipe && onDelete ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-menstrual hover:bg-menstrual-light/40"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash weight="bold" className="w-4 h-4 mr-1.5" />
                Eliminar
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                onClick={handleSubmit}
                disabled={!formData.name.trim() || formData.items.length === 0}
              >
                Guardar Receta
              </Button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Foto de la Receta */}
          <div className="flex items-center gap-3 p-3 bg-surface-hover/70 rounded-card border border-border/60">
            <div className="relative w-16 h-16 rounded-button overflow-hidden bg-surface border border-border shrink-0 flex items-center justify-center">
              {formData.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.imageUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageSquare weight="duotone" className="w-8 h-8 text-text-muted/60" />
              )}
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <span className="text-xs font-semibold text-text-main">Foto de la Receta</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  isLoading={isCompressing}
                  leftIcon={<Camera weight="bold" className="w-3.5 h-3.5" />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.imageUrl ? "Cambiar foto" : "Subir foto"}
                </Button>

                {formData.imageUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-menstrual"
                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                  >
                    Quitar
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Nombre, Descripción y Porciones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Nombre de la Receta *"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ej. Tarta de Espinaca y Ricota..."
                required
              />
            </div>

            <NumberInput
              label="Porciones Totales"
              value={formData.servings}
              onChange={(val) => setFormData((prev) => ({ ...prev, servings: val }))}
              min={1}
              max={30}
              step={1}
              unit="porc."
            />
          </div>

          <Input
            label="Descripción o Notas (Opcional)"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Ej. Ideal para preparar el domingo y freezar para la semana."
          />

          <Input
            label="Etiquetas (Separadas por comas)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Ej. Almuerzo, Proteico, Casero, Vegetariano"
          />

          {/* Selector de Ingredientes */}
          <div className="p-4 bg-surface-hover/50 rounded-card border border-border/60 flex flex-col gap-3">
            <span className="text-xs font-semibold text-text-main uppercase tracking-wider">
              Ingredientes de la Receta ({formData.items.length})
            </span>

            <div className="flex flex-col sm:flex-row items-end gap-2">
              <div className="flex-1 w-full flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Seleccionar Alimento
                </label>
                <select
                  value={selectedIngredientId}
                  onChange={(e) => handleIngredientSelectChange(e.target.value)}
                  className="w-full bg-surface text-text-main text-sm rounded-button border border-border px-3 py-2 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">-- Elige un ingrediente del inventario --</option>
                  {foods.map((food) => (
                    <option key={food.id} value={food.id}>
                      {food.isFavorite ? "⭐ " : ""}
                      {food.name} ({food.calories} kcal / {food.portionGrams}
                      {food.portionUnit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-36">
                <NumberInput
                  label={`Cantidad (${selectedFood?.portionUnit || "g"})`}
                  value={ingredientGrams}
                  onChange={(val) => setIngredientGrams(val)}
                  min={1}
                  max={2000}
                  step={selectedFood?.portionUnit === "unit" ? 1 : 10}
                  unit={selectedFood?.portionUnit || "g"}
                />
              </div>

              <Button
                type="button"
                variant="secondary"
                size="md"
                disabled={!selectedIngredientId}
                onClick={handleAddIngredient}
                leftIcon={<Plus weight="bold" className="w-4 h-4" />}
              >
                Agregar
              </Button>
            </div>

            {/* Lista de Ingredientes Agregados */}
            {formData.items.length > 0 ? (
              <div className="flex flex-col gap-2 mt-2">
                {formData.items.map((item, index) => (
                  <div
                    key={`${item.ingredientId}-${index}`}
                    className="flex items-center justify-between p-2.5 bg-surface rounded-button border border-border text-xs"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-text-main">{item.ingredientName}</span>
                      <span className="text-text-muted">
                        {item.quantityGrams}g — {item.calories} kcal (P: {item.proteinG}g | C:{" "}
                        {item.carbsG}g | G: {item.fatG}g)
                      </span>
                    </div>

                    <IconButton
                      icon={<Trash weight="bold" className="w-3.5 h-3.5 text-menstrual" />}
                      aria-label="Eliminar ingrediente"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveIngredient(index)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted italic py-1">
                Aún no has agregado ingredientes a esta receta.
              </p>
            )}
          </div>

          {/* Resumen de Macros Calculados en Vivo */}
          <div className="p-4 bg-gradient-to-br from-surface to-surface-hover/80 rounded-card border border-border flex flex-col gap-3 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Por 1 Porción ({calculatedMacros.caloriesPerServing} kcal):
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  <MacroNutrientPill type="protein" value={calculatedMacros.proteinPerServing} />
                  <MacroNutrientPill type="carbs" value={calculatedMacros.carbsPerServing} />
                  <MacroNutrientPill type="fat" value={calculatedMacros.fatPerServing} />
                </div>
              </div>

              <div className="text-right text-xs text-text-muted">
                <span>Total de la preparación: </span>
                <span className="font-bold text-text-main">{calculatedMacros.totalCalories} kcal</span>
              </div>
            </div>
          </div>

          {/* Pasos de Preparación */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Pasos de Preparación (Opcional)
            </span>

            {formData.steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-muted w-4">{idx + 1}.</span>
                <Input
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  placeholder={`Paso ${idx + 1}...`}
                />
                {formData.steps.length > 1 && (
                  <IconButton
                    icon={<Trash weight="bold" className="w-3.5 h-3.5 text-text-muted" />}
                    aria-label="Eliminar paso"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveStep(idx)}
                  />
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start mt-1"
              leftIcon={<Plus weight="bold" className="w-3.5 h-3.5" />}
              onClick={handleAddStep}
            >
              Agregar Paso
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="¿Eliminar esta receta?"
        description={`Se eliminará "${editingRecipe?.name}" de tu recetario.`}
        confirmText="Eliminar Receta"
      />
    </>
  );
}
