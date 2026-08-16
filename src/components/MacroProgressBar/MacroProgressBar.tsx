"use client";

import { motion } from "framer-motion";
import type { MacroProgressBarProps } from "./MacroProgressBar.types";

export function MacroProgressBar({
  currentCarbsG,
  targetCarbsG,
  currentProteinG,
  targetProteinG,
  currentFatG,
  targetFatG,
  showLabels = true,
  className = "",
}: MacroProgressBarProps) {
  const carbsRatio = targetCarbsG > 0 ? Math.min(100, Math.round((currentCarbsG / targetCarbsG) * 100)) : 0;
  const proteinRatio = targetProteinG > 0 ? Math.min(100, Math.round((currentProteinG / targetProteinG) * 100)) : 0;
  const fatRatio = targetFatG > 0 ? Math.min(100, Math.round((currentFatG / targetFatG) * 100)) : 0;

  const macros = [
    {
      label: "Carbos",
      current: currentCarbsG,
      target: targetCarbsG,
      ratio: carbsRatio,
      barColor: "bg-[#F4A261]",
      textColor: "text-[#B96216]",
    },
    {
      label: "Proteínas",
      current: currentProteinG,
      target: targetProteinG,
      ratio: proteinRatio,
      barColor: "bg-[#E76F51]",
      textColor: "text-[#B33F23]",
    },
    {
      label: "Grasas",
      current: currentFatG,
      target: targetFatG,
      ratio: fatRatio,
      barColor: "bg-[#2A9D8F]",
      textColor: "text-[#166E63]",
    },
  ];

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      {macros.map((m) => (
        <div key={m.label} className="flex flex-col gap-1.5">
          {showLabels && (
            <div className="flex items-center justify-between text-xs">
              <span className={`font-semibold ${m.textColor}`}>{m.label}</span>
              <span className="text-text-muted font-medium">
                <span className="text-text-main font-semibold">{m.current}g</span> / {m.target}g
              </span>
            </div>
          )}

          <div className="h-2.5 w-full bg-surface-hover border border-border/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${m.ratio}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`h-full rounded-full ${m.barColor}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
