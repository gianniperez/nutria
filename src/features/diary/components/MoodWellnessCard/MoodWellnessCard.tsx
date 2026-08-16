"use client";

import { Heart, Drop, Smiley } from "@phosphor-icons/react";
import { Card } from "@/components/Card";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { NutriaMascot } from "@/components/NutriaMascot";

interface MoodWellnessCardProps {
  moodScore?: 1 | 2 | 3 | 4 | 5;
  moodNote?: string;
  hasLoveNote?: boolean;
  isPeriodActive?: boolean;
  onSetMood: (score: 1 | 2 | 3 | 4 | 5, note?: string) => Promise<void>;
  onToggleLoveNote: () => Promise<void>;
  onTogglePeriod: () => Promise<void>;
}

export function MoodWellnessCard({
  moodScore,
  moodNote = "",
  hasLoveNote = false,
  isPeriodActive = false,
  onSetMood,
  onToggleLoveNote,
  onTogglePeriod,
}: MoodWellnessCardProps) {
  const moods: {
    score: 1 | 2 | 3 | 4 | 5;
    label: string;
    state: "mood1" | "mood2" | "mood3" | "mood4" | "mood5";
  }[] = [
    { score: 1, label: "Bajo", state: "mood1" },
    { score: 2, label: "Tranqui", state: "mood2" },
    { score: 3, label: "Zen", state: "mood3" },
    { score: 4, label: "Bien", state: "mood4" },
    { score: 5, label: "Enérgico", state: "mood5" },
  ];

  return (
    <Card variant="elevated" padding="md" className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-love-light text-love-dark flex items-center justify-center">
          <Smiley weight="duotone" className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-base text-text-main">
            Estado de Ánimo & Bienestar
          </h3>
          <span className="text-xs text-text-muted">
            Registra tu energía diaria, salud menstrual y notas especiales.
          </span>
        </div>
      </div>

      {/* Selector de 5 Estados de Ánimo con Nutria Mascota */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          ¿Cómo te sientes hoy?
        </span>

        <div className="grid grid-cols-5 gap-2">
          {moods.map((m) => {
            const isSelected = moodScore === m.score;

            return (
              <button
                key={m.score}
                type="button"
                onClick={() => onSetMood(m.score, moodNote)}
                className={`flex flex-col items-center p-2 rounded-card border transition-all cursor-pointer select-none ${
                  isSelected
                    ? "bg-primary-light/50 border-primary shadow-xs"
                    : "bg-surface border-border hover:bg-surface-hover"
                }`}
              >
                <NutriaMascot state={m.state} size="sm" animate={isSelected} />
                <span
                  className={`text-[11px] mt-1 ${
                    isSelected
                      ? "font-bold text-primary-text"
                      : "text-text-muted font-medium"
                  }`}
                >
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Switches de Nota de Amor y Período */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/40">
        <div className="p-2.5 bg-love-light/30 border border-love/30 rounded-card">
          <ToggleSwitch
            checked={hasLoveNote}
            onChange={() => onToggleLoveNote()}
            color="love"
            label={
              <span className="flex items-center gap-1.5 font-semibold text-xs text-love-dark">
                <Heart weight="fill" className="w-4 h-4 text-love-dark" />
                Nota de Amor
              </span>
            }
            description="Marcar este día con cariño"
          />
        </div>

        <div className="p-2.5 bg-menstrual-light/30 border border-menstrual/30 rounded-card">
          <ToggleSwitch
            checked={isPeriodActive}
            onChange={() => onTogglePeriod()}
            color="menstrual"
            label={
              <span className="flex items-center gap-1.5 font-semibold text-xs text-menstrual-dark">
                <Drop weight="fill" className="w-4 h-4 text-menstrual-dark" />
                Menstruación Activa
              </span>
            }
            description="Día de sangrado menstrual 🩸"
          />
        </div>
      </div>
    </Card>
  );
}
