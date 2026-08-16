"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus } from "@phosphor-icons/react";
import type { StatCardProps } from "./StatCard.types";

const iconBgStyles = {
  primary: "bg-primary-light/80 text-primary-text",
  secondary: "bg-secondary-light/80 text-secondary-text",
  accent: "bg-accent-light/80 text-accent-dark",
  menstrual: "bg-menstrual-light/80 text-menstrual-dark",
  love: "bg-love-light/80 text-love-dark",
  neutral: "bg-surface-hover text-text-muted",
};

export function StatCard({
  title,
  value,
  unit,
  subtitle,
  icon,
  variant = "neutral",
  trend,
  onClick,
  className = "",
}: StatCardProps) {
  const isClickable = Boolean(onClick);

  return (
    <motion.div
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`bg-surface border border-border rounded-card p-4 sm:p-5 shadow-xs flex flex-col justify-between ${
        isClickable ? "cursor-pointer hover:border-primary/50 transition-colors" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBgStyles[variant]}`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1 my-1">
        <span className="font-display font-bold text-2xl sm:text-3xl text-text-main">
          {value}
        </span>
        {unit && <span className="text-sm font-semibold text-text-muted">{unit}</span>}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-border/40 text-xs">
          {subtitle && <span className="text-text-muted truncate">{subtitle}</span>}
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium shrink-0 ${
                trend.direction === "up"
                  ? "text-secondary-dark"
                  : trend.direction === "down"
                  ? "text-accent-dark"
                  : "text-text-muted"
              }`}
            >
              {trend.direction === "up" ? (
                <ArrowUpRight weight="bold" className="w-3.5 h-3.5" />
              ) : trend.direction === "down" ? (
                <ArrowDownRight weight="bold" className="w-3.5 h-3.5" />
              ) : (
                <Minus weight="bold" className="w-3.5 h-3.5" />
              )}
              {trend.text}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
