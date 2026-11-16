"use client";

import { Heart, Drop, Smiley } from "@phosphor-icons/react";
import { Card } from "@/components/Card";
import { NutriaMascot } from "@/components/NutriaMascot";

interface MoodWellnessCardProps {
  moodScore?: 1 | 2 | 3 | 4 | 5;
  moodNote?: string;
  hasLoveNote?: boolean;
  isPeriodActive?: boolean;
  isPeriodStart?: boolean;
  isPeriodEnd?: boolean;
  onSetMood: (score: 1 | 2 | 3 | 4 | 5, note?: string) => Promise<void>;
  onToggleLoveNote: () => Promise<void>;
  onStartNewCycle?: () => Promise<void>;
  onEndPeriod?: () => Promise<void>;
}

export function MoodWellnessCard({
  moodScore,
  moodNote = "",
  hasLoveNote = false,
  isPeriodActive = false,
  isPeriodStart = false,
  isPeriodEnd = false,
  onSetMood,
  onToggleLoveNote,
  onStartNewCycle,
  onEndPeriod,
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

      {/* Tarjetas de Nota de Amor y Ciclo Menstrual (Estilo Maya: 1 acción directa por tarjeta) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/40">
        {/* Tarjeta 1: Nota de Amor */}
        <div
          className={`p-3 rounded-card border transition-all flex flex-col justify-between gap-3 ${
            hasLoveNote
              ? "bg-love-light/40 border-love/50 shadow-2xs"
              : "bg-surface border-border hover:bg-surface-hover"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                hasLoveNote
                  ? "bg-love text-white shadow-2xs"
                  : "bg-love-light/60 text-love-dark"
              }`}
            >
              <Heart
                weight={hasLoveNote ? "fill" : "duotone"}
                className="w-4 h-4"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-text-main truncate">
                Nota de Amor
              </span>
              <span className="text-[11px] text-text-muted truncate">
                {hasLoveNote
                  ? "Día marcado con cariño 💕"
                  : "Marcar este día con cariño"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleLoveNote()}
            className={`w-full py-2 px-3 rounded-button text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 ${
              hasLoveNote
                ? "bg-love text-white hover:bg-love-dark shadow-xs"
                : "bg-surface hover:bg-love-light/50 text-love-dark border border-love/40"
            }`}
          >
            <Heart
              weight={hasLoveNote ? "fill" : "bold"}
              className="w-3.5 h-3.5"
            />
            {hasLoveNote ? "Quitar Nota de Amor" : "Marcar Nota de Amor"}
          </button>
        </div>

        {/* Tarjeta 2: Ciclo Menstrual (Estilo Maya: Iniciar período / Finalizar período) */}
        <div
          className={`p-3 rounded-card border transition-all flex flex-col justify-between gap-3 ${
            isPeriodActive
              ? "bg-menstrual-light/40 border-menstrual/50 shadow-2xs"
              : "bg-surface border-border hover:bg-surface-hover"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                isPeriodActive
                  ? "bg-menstrual text-white shadow-2xs"
                  : "bg-menstrual-light/60 text-menstrual-dark"
              }`}
            >
              <Drop
                weight={isPeriodActive ? "fill" : "duotone"}
                className="w-4 h-4"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-text-main truncate">
                Ciclo Menstrual
              </span>
              <span className="text-[11px] text-text-muted truncate">
                {isPeriodActive
                  ? isPeriodStart
                    ? "Inicio de período (Día 1) 🩸"
                    : isPeriodEnd
                      ? "Fin de período registrado"
                      : "Sangrado menstrual activo 🩸"
                  : "Sin período registrado hoy"}
              </span>
            </div>
          </div>

          {isPeriodActive ? (
            <button
              type="button"
              onClick={() => onEndPeriod?.()}
              className="w-full py-2 px-3 rounded-button text-xs font-semibold flex items-center justify-center gap-1.5 transition-all bg-menstrual text-white hover:bg-menstrual-dark shadow-xs cursor-pointer active:scale-98"
            >
              <Drop weight="fill" className="w-3.5 h-3.5" />
              {isPeriodEnd
                ? "Período finalizado aquí (Desmarcar)"
                : "Finalizar período hoy"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onStartNewCycle?.()}
              className="w-full py-2 px-3 rounded-button text-xs font-semibold flex items-center justify-center gap-1.5 transition-all bg-surface hover:bg-menstrual-light/50 text-menstrual-dark border border-menstrual/40 cursor-pointer active:scale-98"
            >
              <Drop weight="bold" className="w-3.5 h-3.5 text-menstrual" />
              Iniciar ciclo hoy (Día 1)
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
