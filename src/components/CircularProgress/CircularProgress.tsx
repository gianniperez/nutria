"use client";

import { motion } from "framer-motion";
import type { CircularProgressProps } from "./CircularProgress.types";

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  color = "var(--color-primary)",
  trackColor = "var(--color-border)",
  children,
  className = "",
}: CircularProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Centered Content */}
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center select-none">
          {children}
        </div>
      )}
    </div>
  );
}
