import type { ReactNode } from "react";

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: string;
  disabled?: boolean;
  color?: "primary" | "menstrual" | "love" | "secondary";
  className?: string;
}
