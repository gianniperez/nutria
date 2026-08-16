import type { ReactNode } from "react";

export interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "menstrual" | "love" | "neutral";
  trend?: {
    direction: "up" | "down" | "neutral";
    text: string;
  };
  onClick?: () => void;
  className?: string;
}
