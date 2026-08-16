"use client";

import { motion } from "framer-motion";
import { CircleNotch } from "@phosphor-icons/react";
import type { IconButtonProps } from "./IconButton.types";
import type { ButtonVariant, ButtonSize } from "../Button/Button.types";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-text hover:bg-primary-dark active:bg-primary-dark shadow-sm",
  secondary:
    "bg-secondary text-secondary-text hover:bg-secondary-dark active:bg-secondary-dark shadow-sm",
  accent:
    "bg-accent text-white hover:bg-accent-dark active:bg-accent-dark shadow-sm",
  menstrual:
    "bg-menstrual text-white hover:bg-menstrual-dark active:bg-menstrual-dark shadow-sm",
  love:
    "bg-love text-white hover:bg-love-dark active:bg-love-dark shadow-sm",
  outline:
    "border border-border bg-surface text-text-main hover:bg-surface-hover active:bg-border",
  ghost:
    "bg-transparent text-text-main hover:bg-surface-hover active:bg-border",
  danger:
    "bg-menstrual text-white hover:bg-menstrual-dark active:bg-menstrual-dark",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "w-8 h-8 text-base",
  md: "w-10 h-10 text-lg",
  lg: "w-12 h-12 text-xl",
};

export function IconButton({
  icon,
  "aria-label": ariaLabel,
  variant = "ghost",
  size = "md",
  shape = "circle",
  isLoading = false,
  disabled,
  className = "",
  onClick,
  type = "button",
  ...props
}: IconButtonProps) {
  const isDisabled = disabled || isLoading;
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-button";

  return (
    <motion.button
      whileTap={isDisabled ? undefined : { scale: 0.92 }}
      type={type}
      aria-label={ariaLabel}
      title={ariaLabel}
      disabled={isDisabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center shrink-0 transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${shapeClass} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...(props as object)}
    >
      {isLoading ? (
        <CircleNotch className="w-4 h-4 animate-spin" weight="bold" />
      ) : (
        icon
      )}
    </motion.button>
  );
}
