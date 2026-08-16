export type NutriaMoodState =
  | "mood1" // Acurrucada con mantita
  | "mood2" // Tomando té calentito
  | "mood3" // Flotando relajada en el agua
  | "mood4" // Contenta y sonriente
  | "mood5" // Enérgica con gafas de sol
  | "menstrual" // Con bolsita de agua caliente
  | "streak"; // Celebrando entrenamiento con pesa

export interface NutriaMascotProps {
  state?: NutriaMoodState;
  moodScore?: 1 | 2 | 3 | 4 | 5;
  isPeriodActive?: boolean;
  isStreakActive?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
}
