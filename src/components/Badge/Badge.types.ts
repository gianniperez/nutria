import type { ReactNode } from "react";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "menstrual"
  | "love"
  | "neutral"
  | "carbs"
  | "protein"
  | "fat"
  | "follicular"
  | "ovulation"
  | "luteal";

export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  className?: string;
}
