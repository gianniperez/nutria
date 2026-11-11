import type { BadgeProps, BadgeVariant, BadgeSize } from "./Badge.types";

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary-light text-primary-text border border-primary/40",
  secondary: "bg-secondary-light text-secondary-text border border-secondary/40",
  accent: "bg-accent-light text-accent-dark border border-accent/40",
  menstrual: "bg-menstrual-light text-menstrual-dark border border-menstrual/40",
  love: "bg-love-light text-love-dark border border-love/40",
  neutral: "bg-surface-hover text-text-muted border border-border",
  carbs: "bg-primary-light/60 text-primary-text border border-primary/40",
  protein: "bg-accent-light/50 text-accent-dark border border-accent/40",
  fat: "bg-secondary-light/60 text-secondary-text border border-secondary/40",
  follicular: "bg-follicular-light text-follicular-dark border border-follicular/40",
  ovulation: "bg-ovulation-light text-ovulation-dark border border-ovulation/40",
  luteal: "bg-luteal-light text-luteal-dark border border-luteal/40",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs gap-1 font-medium",
  md: "px-2.5 py-1 text-xs gap-1.5 font-semibold",
};

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  icon,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide shrink-0 select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
