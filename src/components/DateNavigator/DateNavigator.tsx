"use client";

import { CaretLeft, CaretRight, CalendarBlank } from "@phosphor-icons/react";
import { format, parseISO, addDays, subDays, isToday, isYesterday, isTomorrow } from "date-fns";
import { es } from "date-fns/locale";
import { IconButton } from "../IconButton";
import type { DateNavigatorProps } from "./DateNavigator.types";

export function DateNavigator({
  selectedDate,
  onDateChange,
  badge,
  className = "",
}: DateNavigatorProps) {
  const currentDateObj = parseISO(selectedDate);

  const handlePrevDay = () => {
    const prev = subDays(currentDateObj, 1);
    onDateChange(format(prev, "yyyy-MM-dd"));
  };

  const handleNextDay = () => {
    const next = addDays(currentDateObj, 1);
    onDateChange(format(next, "yyyy-MM-dd"));
  };

  const handleSetToday = () => {
    onDateChange(format(new Date(), "yyyy-MM-dd"));
  };

  // Formatear texto amigable (Hoy, Ayer, Mañana o "Lunes, 14 de Agosto")
  let displayTitle = format(currentDateObj, "EEEE, d 'de' MMMM", { locale: es });
  displayTitle = displayTitle.charAt(0).toUpperCase() + displayTitle.slice(1);

  if (isToday(currentDateObj)) {
    displayTitle = `Hoy, ${format(currentDateObj, "d 'de' MMMM", { locale: es })}`;
  } else if (isYesterday(currentDateObj)) {
    displayTitle = `Ayer, ${format(currentDateObj, "d 'de' MMMM", { locale: es })}`;
  } else if (isTomorrow(currentDateObj)) {
    displayTitle = `Mañana, ${format(currentDateObj, "d 'de' MMMM", { locale: es })}`;
  }

  return (
    <div
      className={`flex items-center justify-between gap-2 p-2 bg-surface border border-border rounded-card shadow-xs ${className}`}
    >
      <IconButton
        icon={<CaretLeft weight="bold" className="w-4 h-4" />}
        aria-label="Día anterior"
        size="sm"
        variant="ghost"
        onClick={handlePrevDay}
      />

      <div className="flex flex-col items-center justify-center text-center flex-1 min-w-0">
        <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={handleSetToday}>
          <span className="font-display font-bold text-sm sm:text-base text-text-main truncate">
            {displayTitle}
          </span>
          {!isToday(currentDateObj) && (
            <span className="text-[10px] bg-primary-light text-primary-text font-bold px-1.5 py-0.5 rounded-full">
              Ir a Hoy
            </span>
          )}
        </div>

        {badge && <div className="mt-0.5">{badge}</div>}
      </div>

      <div className="flex items-center gap-1">
        <label className="cursor-pointer relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && onDateChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            aria-label="Seleccionar fecha en calendario"
          />
          <IconButton
            icon={<CalendarBlank weight="duotone" className="w-4 h-4 text-text-muted" />}
            aria-label="Abrir calendario"
            size="sm"
            variant="ghost"
          />
        </label>

        <IconButton
          icon={<CaretRight weight="bold" className="w-4 h-4" />}
          aria-label="Día siguiente"
          size="sm"
          variant="ghost"
          onClick={handleNextDay}
        />
      </div>
    </div>
  );
}
