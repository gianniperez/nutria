"use client";

import { useState } from "react";
import { Check } from "@phosphor-icons/react";
import { Modal } from "@/components/Modal";
import { NumberInput } from "@/components/NumberInput";
import { Button } from "@/components/Button";
import type { EditMealItemModalProps } from "./EditMealItemModal.types";

export function EditMealItemModal({
  isOpen,
  onClose,
  mealType,
  mealTitle,
  item,
  onSaveQuantity,
}: EditMealItemModalProps) {
  const [prevItemId, setPrevItemId] = useState<string | null>(item?.id ?? null);
  const [quantity, setQuantity] = useState<number>(item?.quantityGrams ?? 100);
  const [isSaving, setIsSaving] = useState(false);

  // Sincronizar cantidad cuando cambia el item seleccionado durante el render
  if (item && item.id !== prevItemId) {
    setPrevItemId(item.id);
    setQuantity(item.quantityGrams || (item.recipeId ? 1 : 100));
  }

  if (!isOpen || !item || !mealType) return null;

  const isRecipe = Boolean(item.recipeId);
  const prevQty = item.quantityGrams || 1;
  const factor = quantity / prevQty;

  const calculatedCalories = Math.round(item.calories * factor);
  const calculatedProtein = Number((item.proteinG * factor).toFixed(1));
  const calculatedCarbs = Number((item.carbsG * factor).toFixed(1));
  const calculatedFat = Number((item.fatG * factor).toFixed(1));

  const handleSave = async () => {
    if (quantity <= 0) return;
    setIsSaving(true);
    try {
      await onSaveQuantity(mealType, item.id, quantity);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar cantidad`}
      description={`Ajusta la porción de "${item.name}" en ${mealTitle}.`}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-between gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            size="sm"
            isLoading={isSaving}
            onClick={handleSave}
            leftIcon={<Check weight="bold" className="w-3.5 h-3.5" />}
          >
            Guardar ({calculatedCalories} kcal)
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="p-3.5 bg-surface-hover/70 border border-border/80 rounded-card flex flex-col gap-1.5">
          <span className="font-semibold text-sm text-text-main truncate">
            {item.name}
          </span>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="font-semibold text-primary-text">{calculatedCalories} kcal</span>
            <span>•</span>
            <span>(P: {calculatedProtein}g | C: {calculatedCarbs}g | G: {calculatedFat}g)</span>
          </div>
        </div>

        <NumberInput
          label={isRecipe ? "Porciones a consumir" : "Gramos / Cantidad"}
          value={quantity}
          onChange={setQuantity}
          min={isRecipe ? 0.25 : 1}
          max={isRecipe ? 20 : 5000}
          step={isRecipe ? 0.5 : 10}
          unit={isRecipe ? "porc." : "g"}
        />
      </div>
    </Modal>
  );
}
