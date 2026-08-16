"use client";

import { motion } from "framer-motion";
import { CircleNotch } from "@phosphor-icons/react";
import type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";

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
    "border-2 border-border bg-transparent text-text-main hover:bg-surface-hover active:bg-border",
  ghost:
    "bg-transparent text-text-main hover:bg-surface-hover active:bg-border",
  danger:
    "bg-menstrual text-white hover:bg-menstrual-dark active:bg-menstrual-dark",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-button gap-1.5 font-medium",
  md: "px-4 py-2 text-sm rounded-button gap-2 font-medium",
  lg: "px-6 py-3 text-base rounded-button gap-2.5 font-semibold",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = "",
  onClick,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...(props as object)}
    >
      {isLoading ? (
        <CircleNotch className="w-4 h-4 animate-spin" weight="bold" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
}
