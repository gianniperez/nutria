"use client";

import { useState } from "react";
import { Calculator } from "@phosphor-icons/react";
import { Modal } from "@/components/Modal";
import { NumberInput } from "@/components/NumberInput";
import { MacroNutrientPill } from "@/components/MacroNutrientPill";
import { Button } from "@/components/Button";
import type { Ingredient } from "@/types/database";

interface PortionCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: Ingredient | null;
  onConfirmPortion?: (food: Ingredient, quantityGrams: number) => void;
}

export function PortionCalculatorModal({
  isOpen,
  onClose,
  food,
  onConfirmPortion,
}: PortionCalculatorModalProps) {
  if (!food || !isOpen) return null;

  return (
    <PortionCalculatorContent
      isOpen={isOpen}
      onClose={onClose}
      food={food}
      onConfirmPortion={onConfirmPortion}
    />
  );
}

function PortionCalculatorContent({
  isOpen,
  onClose,
  food,
  onConfirmPortion,
}: {
  isOpen: boolean;
  onClose: () => void;
  food: Ingredient;
  onConfirmPortion?: (food: Ingredient, quantityGrams: number) => void;
}) {
  const [quantity, setQuantity] = useState<number>(food.portionGrams || 100);

  const basePortion = food.portionGrams || 100;
  const factor = quantity > 0 ? quantity / basePortion : 0;

  const computedCalories = Math.round(food.calories * factor);
  const computedProtein = Number((food.proteinG * factor).toFixed(1));
  const computedCarbs = Number((food.carbsG * factor).toFixed(1));
  const computedFat = Number((food.fatG * factor).toFixed(1));

  const quickPresets = [25, 50, 100, 150, 200, 250];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Calculator weight="duotone" className="w-5 h-5 text-secondary-text" />
          <span>Calculadora de Porción</span>
        </div>
      }
      description={`Calcula macros exactos para "${food.name}".`}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
          {onConfirmPortion && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onConfirmPortion(food, quantity);
                onClose();
              }}
            >
              Confirmar Porción
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Selector de Cantidad */}
        <NumberInput
          label={`Cantidad a consumir (${food.portionUnit})`}
          value={quantity}
          onChange={(val) => setQuantity(val)}
          min={1}
          max={3000}
          step={5}
          unit={food.portionUnit}
        />

        {/* Botones Rápidos de Selección */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-text-muted mr-1">Rápido:</span>
          {quickPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setQuantity(preset)}
              className={`text-xs px-2.5 py-1 rounded-button border transition-colors cursor-pointer ${
                quantity === preset
                  ? "bg-primary text-primary-text font-semibold border-primary-dark"
                  : "bg-surface text-text-muted border-border hover:bg-surface-hover"
              }`}
            >
              {preset}
              {food.portionUnit}
            </button>
          ))}
        </div>

        {/* Resultado Proyectado en Vivo */}
        <div className="p-4 bg-gradient-to-br from-surface to-surface-hover/80 rounded-card border border-border flex flex-col items-center text-center mt-2 shadow-xs">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Total Proyectado para {quantity}
            {food.portionUnit}
          </span>

          <h3 className="font-display font-bold text-3xl text-text-main my-1">
            {computedCalories}{" "}
            <span className="text-sm font-semibold text-text-muted">kcal</span>
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <MacroNutrientPill type="protein" value={computedProtein} />
            <MacroNutrientPill type="carbs" value={computedCarbs} />
            <MacroNutrientPill type="fat" value={computedFat} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
