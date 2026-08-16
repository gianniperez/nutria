export type MacroType = "carbs" | "protein" | "fat" | "calories";

export interface MacroNutrientPillProps {
  type: MacroType;
  value: number;
  label?: string;
  unit?: string;
  size?: "sm" | "md";
  className?: string;
}
