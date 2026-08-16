import type { ReactNode } from "react";

export interface CircularProgressProps {
  value: number; // Porcentaje 0 a 100
  size?: number; // Diámetro en px (default 120)
  strokeWidth?: number; // Grosor en px (default 10)
  color?: string; // CSS color o clase
  trackColor?: string;
  children?: ReactNode;
  className?: string;
}
