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
          const isPeriod =
            cell.dailyLog?.isPeriodActive ||
            cell.cycleInfo.phase === "menstrual";

          return (
            <button
              key={cell.dateStr}
              type="button"
              onClick={() => onSelectDay(cell)}
              className={`min-h-[72px] sm:min-h-[85px] p-1.5 rounded-xl border border-border transition-all flex flex-col justify-between text-left cursor-pointer ${bgClass} ${
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
                    <Heart
                      weight="fill"
                      className="w-3 h-3 text-love-dark animate-pulse"
                    />
                  )}
                  {isPeriod && (
                    <Drop
                      weight="fill"
                      className="w-3 h-3 text-menstrual-dark"
                    />
                  )}
                </div>
              </div>

              {/* Registro Calórico y Actividad */}
              <div className="flex flex-col gap-0.5 mt-auto">
                {cell.totalCalories > 0 ? (
                  <div className="flex items-center justify-between text-[10px] font-semibold text-text-main bg-surface/70 px-1 py-0.5 rounded-sm">
                    <span>{cell.totalCalories} kcal</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        cell.isCalorieGoalMet
                          ? "bg-primary-dark"
                          : "bg-[#F4A261]"
                      }`}
                    />
                  </div>
                ) : cell.isCurrentMonth ? (
                  <span className="text-[10px] text-text-muted/60 pl-0.5">
                    Día {cell.cycleInfo.cycleDay}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
