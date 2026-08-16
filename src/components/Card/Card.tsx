"use client";

import { motion } from "framer-motion";
import type { CardProps, CardVariant } from "./Card.types";

const variantStyles: Record<CardVariant, string> = {
  elevated: "bg-surface border border-border/80 shadow-sm",
  flat: "bg-surface-hover/80 border border-border/60",
  interactive:
    "bg-surface border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer",
  menstrual:
    "bg-menstrual-light/40 border border-menstrual/30 shadow-xs",
  accent:
    "bg-accent-light/30 border border-accent/30 shadow-xs",
};

const paddingStyles = {
  none: "p-0",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-5",
  lg: "p-5 sm:p-6",
};

export function Card({
  children,
  variant = "elevated",
  padding = "md",
  className = "",
  onClick,
  ...props
}: CardProps) {
  const isInteractive = variant === "interactive" || Boolean(onClick);

  if (isInteractive) {
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`rounded-card overflow-hidden ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
        {...(props as object)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`rounded-card overflow-hidden ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
