"use client";

import { motion } from "framer-motion";
import type { ToggleSwitchProps } from "./ToggleSwitch.types";

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  color = "primary",
  className = "",
}: ToggleSwitchProps) {
  const activeColorStyles = {
    primary: "bg-primary border-primary-dark",
    menstrual: "bg-menstrual border-menstrual-dark",
    love: "bg-love border-love-dark",
    secondary: "bg-secondary border-secondary-dark",
  };

  return (
    <label
      className={`inline-flex items-center justify-between gap-3 select-none cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-medium text-text-main">{label}</span>}
          {description && <span className="text-xs text-text-muted">{description}</span>}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer ${
          checked ? activeColorStyles[color] : "bg-border/60 border-border"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm pointer-events-none transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}
