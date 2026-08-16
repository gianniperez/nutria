import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ButtonVariant, ButtonSize } from "../Button/Button.types";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  "aria-label": string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  shape?: "circle" | "square";
}
