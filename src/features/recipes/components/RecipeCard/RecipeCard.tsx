"use client";

import { CookingPot, Users, Eye, PencilSimple } from "@phosphor-icons/react";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { IconButton } from "@/components/IconButton";
import { MacroNutrientPill } from "@/components/MacroNutrientPill";
import type { Recipe } from "@/types/database";

interface RecipeCardProps {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
  onEdit?: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onView, onEdit }: RecipeCardProps) {
  return (
    <Card
      variant="elevated"
      padding="sm"
      className="flex flex-col justify-between gap-3 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-start gap-3">
        {/* Foto o Icono */}
        <div className="w-14 h-14 rounded-button overflow-hidden bg-surface-hover border border-border shrink-0 flex items-center justify-center">
          {recipe.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <CookingPot weight="duotone" className="w-7 h-7 text-primary-text" />
          )}
        </div>

        {/* Información Principal */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-sm sm:text-base text-text-main truncate">
              {recipe.name}
            </h4>

            <Badge variant="secondary" size="sm" icon={<Users weight="bold" className="w-3 h-3" />}>
              {recipe.servings} {recipe.servings === 1 ? "porción" : "porciones"}
            </Badge>
          </div>

          {recipe.description && (
            <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
              {recipe.description}
            </p>
          )}

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-surface-hover text-text-muted px-1.5 py-0.5 rounded-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desglose de Macros por Porción */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-text-muted mr-1">Por porción:</span>
          <MacroNutrientPill type="calories" value={recipe.caloriesPerServing} size="sm" />
          <MacroNutrientPill type="protein" value={recipe.proteinPerServing} size="sm" />
          <MacroNutrientPill type="carbs" value={recipe.carbsPerServing} size="sm" />
          <MacroNutrientPill type="fat" value={recipe.fatPerServing} size="sm" />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <IconButton
              icon={<PencilSimple weight="bold" className="w-4 h-4 text-text-muted" />}
              aria-label="Editar receta"
              size="sm"
              variant="ghost"
              onClick={() => onEdit(recipe)}
            />
          )}

          <IconButton
            icon={<Eye weight="duotone" className="w-4 h-4 text-primary-text" />}
            aria-label="Ver detalle de receta"
            size="sm"
            variant="outline"
            onClick={() => onView(recipe)}
          />
        </div>
      </div>
    </Card>
  );
}
