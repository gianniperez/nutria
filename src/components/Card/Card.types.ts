import type { HTMLAttributes, ReactNode } from "react";

export type CardVariant = "elevated" | "flat" | "interactive" | "menstrual" | "accent";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}
