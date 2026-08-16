"use client";

import { CookingPot, Users, CheckCircle, ListNumbers } from "@phosphor-icons/react";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/Badge";
import { MacroNutrientPill } from "@/components/MacroNutrientPill";
import { Button } from "@/components/Button";
import type { Recipe } from "@/types/database";

interface RecipeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  onLogServing?: (recipe: Recipe) => void;
}

export function RecipeDetailModal({
  isOpen,
  onClose,
  recipe,
  onLogServing,
}: RecipeDetailModalProps) {
  if (!recipe || !isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recipe.name}
      description={recipe.description || `Receta casera rendidora de ${recipe.servings} porciones.`}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
          {onLogServing && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle weight="bold" className="w-4 h-4" />}
              onClick={() => {
                onLogServing(recipe);
                onClose();
              }}
            >
              Registrar 1 Porción ({recipe.caloriesPerServing} kcal)
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Imagen de la Receta */}
        {recipe.imageUrl ? (
          <div className="w-full h-44 rounded-card overflow-hidden border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        {/* Badges de Porciones y Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" size="md" icon={<Users weight="bold" className="w-3.5 h-3.5" />}>
            Rinde {recipe.servings} {recipe.servings === 1 ? "porción" : "porciones"}
          </Badge>

          {recipe.tags?.map((t) => (
            <Badge key={t} variant="neutral" size="sm">
              #{t}
            </Badge>
          ))}
        </div>

        {/* Desglose Nutricional por Porción */}
        <div className="p-4 bg-gradient-to-br from-surface to-surface-hover/80 rounded-card border border-border flex flex-col gap-2">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Valores Nutricionales por Porción:
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <MacroNutrientPill type="calories" value={recipe.caloriesPerServing} />
            <MacroNutrientPill type="protein" value={recipe.proteinPerServing} />
            <MacroNutrientPill type="carbs" value={recipe.carbsPerServing} />
            <MacroNutrientPill type="fat" value={recipe.fatPerServing} />
          </div>
        </div>

        {/* Lista de Ingredientes */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-text-main uppercase tracking-wider flex items-center gap-1.5">
            <CookingPot weight="duotone" className="w-4 h-4 text-primary" />
            Ingredientes ({recipe.items.length})
          </span>

          <div className="flex flex-col gap-1.5">
            {recipe.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-surface-hover/60 rounded-button border border-border/60 text-xs"
              >
                <span className="font-semibold text-text-main">{item.ingredientName}</span>
                <span className="text-text-muted font-medium">
                  {item.quantityGrams}g ({item.calories} kcal)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pasos de Preparación */}
        {recipe.steps && recipe.steps.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-main uppercase tracking-wider flex items-center gap-1.5">
              <ListNumbers weight="duotone" className="w-4 h-4 text-secondary-text" />
              Instrucciones
            </span>

            <ol className="flex flex-col gap-2 list-decimal list-inside text-xs text-text-main">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="p-2 bg-surface rounded-button border border-border/40 leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </Modal>
  );
}
