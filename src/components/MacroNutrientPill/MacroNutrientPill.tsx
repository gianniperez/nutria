import type { MacroNutrientPillProps, MacroType } from "./MacroNutrientPill.types";

const typeStyles: Record<
  MacroType,
  { bg: string; text: string; dot: string; defaultLabel: string; defaultUnit: string }
> = {
  calories: {
    bg: "bg-surface-hover border-border",
    text: "text-text-main",
    dot: "bg-primary",
    defaultLabel: "Kcal",
    defaultUnit: "kcal",
  },
  carbs: {
    bg: "bg-[#FDF6ED] border-[#FAD7A0]/60",
    text: "text-[#B96216]",
    dot: "bg-[#F4A261]",
    defaultLabel: "Carbos",
    defaultUnit: "g",
  },
  protein: {
    bg: "bg-[#FDF2F0] border-[#F5B7B1]/60",
    text: "text-[#B33F23]",
    dot: "bg-[#E76F51]",
    defaultLabel: "Proteína",
    defaultUnit: "g",
  },
  fat: {
    bg: "bg-[#EAF7F5] border-[#A2D9CE]/60",
    text: "text-[#166E63]",
    dot: "bg-[#2A9D8F]",
    defaultLabel: "Grasas",
    defaultUnit: "g",
  },
};

export function MacroNutrientPill({
  type,
  value,
  label,
  unit,
  size = "md",
  className = "",
}: MacroNutrientPillProps) {
  const config = typeStyles[type];
  const displayLabel = label || config.defaultLabel;
  const displayUnit = unit || config.defaultUnit;

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs gap-1.5",
    md: "px-2.5 py-1 text-xs gap-2 font-medium",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs select-none ${config.bg} ${sizeStyles[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
      <span className="text-text-muted">{displayLabel}</span>
      <span className={`font-semibold ${config.text}`}>
        {value}
        {displayUnit}
      </span>
    </span>
  );
}
