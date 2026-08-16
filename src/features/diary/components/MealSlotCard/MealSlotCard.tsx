"use client";

import { Sun, BowlFood, Coffee, Cookie, Moon, Plus, Trash, DotsSixVertical, PencilSimple } from "@phosphor-icons/react";
import { Reorder } from "framer-motion";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import type { LoggedFoodItem, MealType, MealSlotConfig } from "../../types";

const slotIcons: Record<string, React.ReactNode> = {
  Sun: <Sun weight="duotone" className="w-5 h-5 text-primary-text" />,
  BowlFood: <BowlFood weight="duotone" className="w-5 h-5 text-secondary-text" />,
  Coffee: <Coffee weight="duotone" className="w-5 h-5 text-primary-text" />,
  Cookie: <Cookie weight="duotone" className="w-5 h-5 text-accent-dark" />,
  Moon: <Moon weight="duotone" className="w-5 h-5 text-secondary-text" />,
};

interface MealSlotCardProps {
  config: MealSlotConfig;
  items: LoggedFoodItem[];
  onAddFood: (mealType: MealType) => void;
  onRemoveItem: (mealType: MealType, itemId: string) => void;
  onEditItem?: (mealType: MealType, item: LoggedFoodItem) => void;
  onReorderItems?: (mealType: MealType, items: LoggedFoodItem[]) => void;
}

export function MealSlotCard({
  config,
  items,
  onAddFood,
  onRemoveItem,
  onEditItem,
  onReorderItems,
}: MealSlotCardProps) {
  const slotTotalCalories = items.reduce((acc, item) => acc + (item.calories || 0), 0);
  const slotTotalProtein = items.reduce((acc, item) => acc + (item.proteinG || 0), 0);

  const handleReorder = (newItems: LoggedFoodItem[]) => {
    if (onReorderItems) {
      onReorderItems(config.type, newItems);
    }
  };

  return (
    <Card variant="elevated" padding="md" className="flex flex-col gap-3">
      {/* Header del Slot */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center shrink-0">
            {slotIcons[config.iconName] || <BowlFood weight="duotone" className="w-5 h-5" />}
          </div>

          <div className="flex flex-col">
            <h3 className="font-display font-bold text-base text-text-main leading-tight">
              {config.title}
            </h3>
            <span className="text-[11px] text-text-muted">{config.subtitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {slotTotalCalories > 0 && (
            <div className="flex items-center gap-1.5 bg-surface-hover px-2.5 py-1 rounded-full text-xs font-semibold">
              <span className="text-text-main">{slotTotalCalories} kcal</span>
              {slotTotalProtein > 0 && (
                <span className="text-secondary-text font-medium">({Math.round(slotTotalProtein)}g prot)</span>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus weight="bold" className="w-3.5 h-3.5" />}
            onClick={() => onAddFood(config.type)}
          >
            Agregar
          </Button>
        </div>
      </div>

      {/* Lista de Alimentos Registrados con Reordenamiento Drag & Drop */}
      {items.length > 0 ? (
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={handleReorder}
          className="flex flex-col gap-1.5 pt-1"
        >
          {items.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className="flex items-center justify-between p-2.5 bg-surface-hover/50 hover:bg-surface-hover/80 rounded-button border border-border/40 text-xs transition-colors select-none"
            >
              {/* Drag Handle */}
              <div
                className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-text-muted/60 hover:text-text-main touch-none shrink-0"
                title="Arrastrar para ordenar"
              >
                <DotsSixVertical weight="bold" className="w-4 h-4" />
              </div>

              <div className="flex flex-col min-w-0 flex-1 px-1.5">
                <span className="font-semibold text-text-main truncate">{item.name}</span>
                <div className="flex items-center gap-2 text-text-muted mt-0.5">
                  <span>{item.quantityGrams > 5 ? `${item.quantityGrams}g` : ""}</span>
                  <span className="font-semibold text-text-main">{item.calories} kcal</span>
                  <span>(P: {item.proteinG}g | C: {item.carbsG}g | G: {item.fatG}g)</span>
                </div>
              </div>

              <div className="flex items-center gap-0.5 shrink-0">
                <IconButton
                  icon={<PencilSimple weight="bold" className="w-3.5 h-3.5 text-text-muted hover:text-primary" />}
                  aria-label="Editar cantidad del alimento"
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditItem?.(config.type, item)}
                />
                <IconButton
                  icon={<Trash weight="bold" className="w-3.5 h-3.5 text-text-muted hover:text-menstrual" />}
                  aria-label="Eliminar alimento del diario"
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveItem(config.type, item.id)}
                />
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <p className="text-xs text-text-muted/70 italic py-1">
          Sin alimentos registrados aún.
        </p>
      )}
    </Card>
  );
}

