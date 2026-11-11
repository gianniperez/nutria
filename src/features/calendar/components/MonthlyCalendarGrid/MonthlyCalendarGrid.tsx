"use client";

import { Drop, Heart } from "@phosphor-icons/react";
import type { CalendarDayCell } from "../../types";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface MonthlyCalendarGridProps {
  cells: CalendarDayCell[];
  onSelectDay: (cell: CalendarDayCell) => void;
}

export function MonthlyCalendarGrid({
  cells,
  onSelectDay,
}: MonthlyCalendarGridProps) {
  const getPhaseBackground = (phase: string, isCurrentMonth: boolean) => {
    if (!isCurrentMonth)
      return "bg-surface/40 text-text-muted/40 border-border/30";

    switch (phase) {
      case "menstrual":
        return "bg-menstrual-light/50 border-menstrual/40 hover:bg-menstrual-light/80";
      case "follicular":
        return "bg-follicular-light/50 border-follicular/40 hover:bg-follicular-light/80";
      case "ovulatory":
        return "bg-ovulation-light/50 border-ovulation/40 hover:bg-ovulation-light/80";
      case "luteal":
        return "bg-luteal-light/50 border-luteal/40 hover:bg-luteal-light/80";
      default:
        return "bg-surface border-border hover:bg-surface-hover";
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full select-none">
      {/* Cabecera de Días de la Semana */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-text-muted pb-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Celdas del Calendario */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((cell) => {
          const bgClass = getPhaseBackground(
            cell.cycleInfo.phase,
            cell.isCurrentMonth,
          );
          const hasLoveNote = cell.dailyLog?.hasLoveNote;
          const isLoggedPeriod = Boolean(cell.dailyLog?.isPeriodActive);
          const isPredictedPeriod =
            !isLoggedPeriod && cell.cycleInfo.phase === "menstrual";

          return (
            <button
              key={cell.dateStr}
              type="button"
              onClick={() => onSelectDay(cell)}
              className={`min-h-[76px] sm:min-h-[88px] p-1.5 rounded-xl border border-border transition-all flex flex-col justify-between text-left cursor-pointer ${bgClass} ${
                cell.isToday ? "ring-2 ring-primary shadow-xs" : ""
              }`}
            >
              {/* Número de Día y Badges Rápidos */}
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs sm:text-sm font-bold ${
                    cell.isToday
                      ? "text-primary-text bg-primary px-1.5 py-0.2 rounded-full"
                      : cell.isCurrentMonth
                        ? "text-text-main"
                        : "text-text-muted/50"
                  }`}
                >
                  {cell.dayNumber}
                </span>

                <div className="flex items-center gap-0.5">
                  {hasLoveNote && (
                    <span title="Nota de Amor 💕">
                      <Heart
                        weight="fill"
                        className="w-3.5 h-3.5 text-love-dark animate-pulse"
                      />
                    </span>
                  )}
                  {isLoggedPeriod && (
                    <span title="Sangrado registrado 🩸">
                      <Drop
                        weight="fill"
                        className="w-3.5 h-3.5 text-menstrual-dark"
                      />
                    </span>
                  )}
                  {isPredictedPeriod && (
                    <span title="Periodo previsto">
                      <Drop
                        weight="duotone"
                        className="w-3.5 h-3.5 text-menstrual/80"
                      />
                    </span>
                  )}
                </div>
              </div>

              {/* Registro de Ciclo Menstrual y Calorías */}
              {cell.isCurrentMonth && (
                <div className="flex flex-col gap-0.5 mt-auto w-full pt-1">
                  <div className="flex items-center justify-between text-[10px] leading-tight text-text-muted px-0.5">
                    <span className="font-bold text-text-main/80">
                      D{cell.cycleInfo.cycleDay}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-text-muted/70 truncate max-w-[48px]">
                      {cell.cycleInfo.phaseName}
                    </span>
                  </div>

                  {cell.totalCalories > 0 && (
                    <div className="flex items-center justify-between text-[10px] font-bold text-text-main bg-surface/90 border border-border/50 px-1 py-0.5 rounded shadow-2xs">
                      <span className="truncate">{cell.totalCalories} kcal</span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ml-0.5 ${
                          cell.isCalorieGoalMet ? "bg-primary" : "bg-accent"
                        }`}
                      />
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
