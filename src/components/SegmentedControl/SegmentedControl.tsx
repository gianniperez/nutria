"use client";

import { motion } from "framer-motion";
import type { SegmentedControlProps } from "./SegmentedControl.types";

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  fullWidth = true,
  size = "md",
  className = "",
  name = "segmented-control",
}: SegmentedControlProps<T>) {
  const sizeStyles = {
    sm: "p-0.5 text-xs",
    md: "p-1 text-sm",
  };

  const itemSizeStyles = {
    sm: "py-1 px-2.5",
    md: "py-1.5 px-3.5",
  };

  return (
    <div
      role="radiogroup"
      className={`inline-flex items-center bg-surface-hover border border-border rounded-button ${sizeStyles[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;

        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className={`relative flex-1 inline-flex items-center justify-center gap-1.5 font-medium rounded-button transition-colors cursor-pointer select-none ${
              itemSizeStyles[size]
            } ${isSelected ? "text-primary-text font-semibold" : "text-text-muted hover:text-text-main"}`}
          >
            {isSelected && (
              <motion.div
                layoutId={`active-indicator-${name}`}
                className="absolute inset-0 bg-primary/30 rounded-button shadow-xs border border-primary/40"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}

            <span className="relative z-10 flex items-center gap-1.5">
              {opt.icon && <span className="shrink-0">{opt.icon}</span>}
              <span>{opt.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
