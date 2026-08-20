"use client";

import { motion } from "framer-motion";
import {
  Star,
  BowlFood,
  Calculator,
  PencilSimple,
} from "@phosphor-icons/react";
import { Card } from "@/components/Card";
import { IconButton } from "@/components/IconButton";
import { MacroNutrientPill } from "@/components/MacroNutrientPill";
import type { Ingredient } from "@/types/database";

interface FoodItemCardProps {
  food: Ingredient;
  onToggleFavorite: (id: string, current: boolean) => void;
  onCalculatePortion?: (food: Ingredient) => void;
  onEdit?: (food: Ingredient) => void;
}

export function FoodItemCard({
  food,
  onToggleFavorite,
  onCalculatePortion,
  onEdit,
}: FoodItemCardProps) {
  return (
    <Card
      variant="elevated"
      padding="sm"
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Imagen del Alimento o Icono Fallback */}
        <div className="w-12 h-12 rounded-button overflow-hidden bg-surface-hover border border-border shrink-0 flex items-center justify-center">
          {food.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={food.imageUrl}
              alt={food.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <BowlFood weight="duotone" className="w-6 h-6 text-primary-text" />
          )}
        </div>

        {/* Info Alimento */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-text-main truncate">
              {food.name}
            </h4>
            {food.brand && (
              <span className="text-[11px] text-text-muted bg-surface-hover px-1.5 py-0.2 rounded-sm truncate">
                {food.brand}
              </span>
            )}
          </div>

          <span className="text-xs text-text-muted mt-0.5">
            {food.portionGrams}
            {food.portionUnit} • {food.calories} kcal
          </span>
        </div>
      </div>

      {/* Desglose de Macros */}
      <div className="flex flex-wrap items-center gap-1.5">
        <MacroNutrientPill type="protein" value={food.proteinG} size="sm" />
        <MacroNutrientPill type="carbs" value={food.carbsG} size="sm" />
        <MacroNutrientPill type="fat" value={food.fatG} size="sm" />
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
        {onCalculatePortion && (
          <IconButton
            icon={
              <Calculator
                weight="duotone"
                className="w-4 h-4 text-secondary-text"
              />
            }
            aria-label="Calcular porción"
            size="sm"
            variant="ghost"
            onClick={() => onCalculatePortion(food)}
          />
        )}

        {onEdit && (
          <IconButton
            icon={
              <PencilSimple weight="bold" className="w-4 h-4 text-text-muted" />
            }
            aria-label="Editar alimento"
            size="sm"
            variant="ghost"
            onClick={() => onEdit(food)}
          />
        )}

        <IconButton
          icon={
            <motion.span whileTap={{ scale: 1.3 }}>
              <Star
                weight={food.isFavorite ? "fill" : "regular"}
                className={`w-4 h-4 ${
                  food.isFavorite ? "text-[#F4A261]" : "text-text-muted/60"
                }`}
              />
            </motion.span>
          }
          aria-label={
            food.isFavorite ? "Quitar de favoritos" : "Marcar como favorito"
          }
          size="sm"
          variant="ghost"
          onClick={() => onToggleFavorite(food.id, food.isFavorite)}
        />
      </div>
    </Card>
  );
}
