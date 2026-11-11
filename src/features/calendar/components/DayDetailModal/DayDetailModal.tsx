"use client";

import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Heart, ArrowRight } from "@phosphor-icons/react";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/Badge";
import { MacroNutrientPill } from "@/components/MacroNutrientPill";
import { NutriaMascot } from "@/components/NutriaMascot";
import { Button } from "@/components/Button";
import type { CalendarDayCell } from "../../types";
import type { MealType } from "@/types/database";

interface DayDetailModalProps {
  cell: CalendarDayCell | null;
  onClose: () => void;
}

export function DayDetailModal({ cell, onClose }: DayDetailModalProps) {
  const router = useRouter();

  if (!cell) return null;

  const parsedDate = parseISO(cell.dateStr);
  const formattedDateTitle = format(parsedDate, "EEEE d 'de' MMMM", { locale: es });

  const handleGoToDiary = () => {
    onClose();
    router.push(`/diario?date=${cell.dateStr}`);
  };

  // Calcular macros del día si existen
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  if (cell.dailyLog?.meals) {
    const slots: MealType[] = ["breakfast", "lunch", "snack_afternoon", "snack", "dinner"];
    for (const slot of slots) {
      for (const item of cell.dailyLog.meals[slot] || []) {
        totalProtein += item.proteinG || 0;
        totalCarbs += item.carbsG || 0;
        totalFat += item.fatG || 0;
      }
    }
  }

  const moodState = cell.dailyLog?.moodScore
    ? (`mood${cell.dailyLog.moodScore}` as "mood1" | "mood2" | "mood3" | "mood4" | "mood5")
    : null;

  return (
    <Modal
      isOpen={Boolean(cell)}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Calendar weight="duotone" className="w-5 h-5 text-primary-text" />
          <span className="capitalize">{formattedDateTitle}</span>
        </div>
      }
      description={`Día ${cell.cycleInfo.cycleDay} del ciclo menstrual.`}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>

          <Button
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight weight="bold" className="w-3.5 h-3.5" />}
            onClick={handleGoToDiary}
          >
            Abrir en el Diario
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Badges de Fase del Ciclo y Estado */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={
              cell.cycleInfo.phase === "menstrual"
                ? "menstrual"
                : cell.cycleInfo.phase === "follicular"
                ? "follicular"
                : cell.cycleInfo.phase === "ovulatory"
                ? "ovulation"
                : "luteal"
            }
            size="md"
          >
            {cell.cycleInfo.phaseName}
          </Badge>

          {cell.dailyLog?.isPeriodActive && (
            <Badge variant="menstrual" size="md">
              Sangrado menstrual 🩸
            </Badge>
          )}

          {cell.dailyLog?.hasLoveNote && (
            <Badge variant="love" size="md" icon={<Heart weight="fill" className="w-3.5 h-3.5" />}>
              Nota de Amor 💕
            </Badge>
          )}
        </div>

        {/* Resumen Nutricional */}
        <div className="p-3.5 bg-surface-hover/70 rounded-card border border-border/60 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Nutrición Registrada
            </span>
            <span className="font-display font-bold text-base text-text-main">
              {cell.totalCalories} kcal
            </span>
          </div>

          {cell.totalCalories > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <MacroNutrientPill type="protein" value={Math.round(totalProtein)} size="sm" />
              <MacroNutrientPill type="carbs" value={Math.round(totalCarbs)} size="sm" />
              <MacroNutrientPill type="fat" value={Math.round(totalFat)} size="sm" />
            </div>
          ) : (
            <p className="text-xs text-text-muted italic">Sin ingestas registradas.</p>
          )}
        </div>

        {/* Estado de Ánimo y Nutria Mascota */}
        {moodState && (
          <div className="p-3 bg-primary-light/30 rounded-card border border-primary/40 flex items-center gap-3">
            <NutriaMascot state={moodState} size="sm" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-primary-text">
                Ánimo Registrado: Nivel {cell.dailyLog?.moodScore} de 5
              </span>
              {cell.dailyLog?.moodNote && (
                <p className="text-[11px] text-text-muted mt-0.5 italic">
                  &ldquo;{cell.dailyLog.moodNote}&rdquo;
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
