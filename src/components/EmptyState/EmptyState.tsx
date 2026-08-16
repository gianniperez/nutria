"use client";

import { Sparkle } from "@phosphor-icons/react";
import { Button } from "../Button";
import type { EmptyStateProps } from "./EmptyState.types";

export function EmptyState({
  title,
  description,
  icon,
  actionText,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-surface/50 border border-dashed border-border rounded-card ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-primary-light/60 text-primary-dark flex items-center justify-center mb-3.5 shadow-xs">
        {icon || <Sparkle weight="duotone" className="w-7 h-7" />}
      </div>

      <h4 className="font-display font-bold text-base sm:text-lg text-text-main mb-1">
        {title}
      </h4>

      {description && (
        <p className="text-xs sm:text-sm text-text-muted max-w-xs sm:max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}

      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
