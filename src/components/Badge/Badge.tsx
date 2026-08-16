import type { BadgeProps, BadgeVariant, BadgeSize } from "./Badge.types";

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary-light text-primary-text border border-primary/40",
  secondary: "bg-secondary-light text-secondary-text border border-secondary/40",
  accent: "bg-accent-light text-accent-dark border border-accent/40",
  menstrual: "bg-menstrual-light text-menstrual-dark border border-menstrual/40",
  love: "bg-love-light text-love-dark border border-love/40",
  neutral: "bg-surface-hover text-text-muted border border-border",
  carbs: "bg-[#FDEBD0] text-[#7E5109] border border-[#F4A261]/40",
  protein: "bg-[#FADBD8] text-[#78281F] border border-[#E76F51]/40",
  fat: "bg-[#D1F2EB] text-[#117A65] border border-[#2A9D8F]/40",
  follicular: "bg-[#E8F8F5] text-[#117A65] border border-[#A8DADC]/40",
  ovulation: "bg-[#FEF9E7] text-[#7D6608] border border-[#F9E79F]",
  luteal: "bg-[#F4ECF7] text-[#512E5F] border border-[#D7BDE2]",
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
