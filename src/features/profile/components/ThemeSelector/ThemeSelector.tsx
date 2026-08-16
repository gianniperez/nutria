"use client";

import { motion } from "framer-motion";
import { Check } from "@phosphor-icons/react";
import { Card } from "@/components/Card";
import type { UserProfile } from "@/types/database";

interface ThemeOption {
  id: UserProfile["selectedTheme"];
  name: string;
  subtitle: string;
  previewColors: [string, string, string]; // [primary, secondary, accent]
}

const THEMES: ThemeOption[] = [
  {
    id: "matcha-peach",
    name: "Matcha & Peach",
    subtitle: "Cálido, fresco y primaveral",
    previewColors: ["#FFB4A2", "#C5D8A4", "#E07A5F"],
  },
  {
    id: "cyber-lilac",
    name: "Cyber Lilac",
    subtitle: "Vibras pastel aesthetic & berry",
    previewColors: ["#D4BEE4", "#F8C8DC", "#D84A75"],
  },
  {
    id: "warm-otter",
    name: "Warm Otter Earth",
    subtitle: "Tonos tierra acogedores & agua marina",
    previewColors: ["#D9A566", "#A8DADC", "#E76F51"],
  },
];

interface ThemeSelectorProps {
  currentTheme: UserProfile["selectedTheme"];
  onThemeSelect: (theme: UserProfile["selectedTheme"]) => void;
}

export function ThemeSelector({ currentTheme, onThemeSelect }: ThemeSelectorProps) {
  return (
    <Card variant="elevated" padding="md" className="flex flex-col gap-3">
      <div className="flex flex-col">
        <h3 className="font-display font-bold text-base text-text-main">
          Paleta de Color & Estilo
        </h3>
        <p className="text-xs text-text-muted">
          Personaliza la atmósfera visual de tu aplicación en cualquier momento.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {THEMES.map((th) => {
          const isSelected = th.id === currentTheme;

          return (
            <motion.button
              key={th.id}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => onThemeSelect(th.id)}
              className={`relative flex flex-col p-3 rounded-card border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-surface-hover border-primary shadow-sm"
                  : "bg-surface border-border hover:border-border/80"
              }`}
            >
              {/* Color dots preview */}
              <div className="flex items-center gap-1.5 mb-2.5">
                {th.previewColors.map((col, idx) => (
                  <span
                    key={idx}
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: col }}
                  />
                ))}

                {isSelected && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-primary text-primary-text flex items-center justify-center">
                    <Check weight="bold" className="w-3 h-3" />
                  </span>
                )}
              </div>

              <span className="text-xs font-semibold text-text-main">{th.name}</span>
              <span className="text-[11px] text-text-muted mt-0.5">{th.subtitle}</span>
            </motion.button>
          );
        })}
      </div>
    </Card>
  );
}
