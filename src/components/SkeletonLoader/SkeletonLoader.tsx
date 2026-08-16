import type { SkeletonLoaderProps } from "./SkeletonLoader.types";

export function SkeletonLoader({
  className = "",
  variant = "rectangular",
  width,
  height,
  count = 1,
}: SkeletonLoaderProps) {
  const baseClasses = "animate-pulse bg-border/60";

  const variantStyles = {
    text: "h-4 rounded-sm",
    circular: "rounded-full aspect-square",
    rectangular: "rounded-button",
    card: "rounded-card h-28 w-full border border-border/40",
  };

  const style: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={style}
          className={`${baseClasses} ${variantStyles[variant]} ${className}`}
        />
      ))}
    </>
  );
}
