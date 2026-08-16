"use client";

import { useState, useMemo, useCallback } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday as isDateToday,
} from "date-fns";
import { es } from "date-fns/locale";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useProfile } from "@/features/profile";
import { getCyclePhaseInfo } from "@/utils/menstrualCycleCalculations";
import type { DailyLog, MealType } from "@/types/database";
import type { CalendarDayCell } from "../types";

export function useCalendar(initialDate = new Date()) {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [selectedCell, setSelectedCell] = useState<CalendarDayCell | null>(null);

  const { profile, macros } = useProfile();
  const targetCalories = macros?.targetCalories || 1800;

  // Cargar todos los logs en memoria reactivamente
  const allLogs = useLiveQuery(async () => {
    return await db.dailyLogs.toArray();
  }, []);

  const logsMap = useMemo(() => {
    const map = new Map<string, DailyLog>();
    if (allLogs) {
      for (const log of allLogs) {
        map.set(log.date, log);
      }
    }
    return map;
  }, [allLogs]);

  // Generar la matriz completa de días del mes (semana comienza en Lunes)
  const monthCells: CalendarDayCell[] = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const daysInterval = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });

    const lastPeriodDate = profile?.lastPeriodDate || "2026-08-01";

    return daysInterval.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayNumber = day.getDate();
      const isCurrentMonth = isSameMonth(day, currentDate);
      const isToday = isDateToday(day);

      const dailyLog = logsMap.get(dateStr);

      const cycleInfo = getCyclePhaseInfo(
        dateStr,
        lastPeriodDate,
        profile?.cycleLengthDays || 28,
        profile?.periodDurationDays || 5
      );

      // Calcular calorías consumidas
      let totalCalories = 0;
      if (dailyLog?.meals) {
        const slots: MealType[] = [
          "breakfast",
          "lunch",
          "snack_afternoon",
          "snack",
          "dinner",
        ];
        for (const slot of slots) {
          for (const item of dailyLog.meals[slot] || []) {
            totalCalories += item.calories || 0;
          }
        }
      }

      const isCalorieGoalMet =
        totalCalories > 0 &&
        Math.abs(totalCalories - targetCalories) <= targetCalories * 0.12;

      const hasActivity =
        Boolean(dailyLog) &&
        (totalCalories > 0 ||
          (dailyLog?.exercises && dailyLog.exercises.length > 0) ||
          Boolean(dailyLog?.moodScore) ||
          Boolean(dailyLog?.hasLoveNote));

      return {
        dateStr,
        dayNumber,
        isCurrentMonth,
        isToday,
        dailyLog,
        cycleInfo,
        totalCalories: Math.round(totalCalories),
        isCalorieGoalMet,
        hasActivity,
      };
    });
  }, [currentDate, logsMap, profile, targetCalories]);

  const monthTitle = useMemo(() => {
    const formatted = format(currentDate, "MMMM yyyy", { locale: es });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, [currentDate]);

  const nextMonth = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1));
  }, []);

  const prevMonth = useCallback(() => {
    setCurrentDate((prev) => subMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return {
    currentDate,
    monthTitle,
    monthCells,
    selectedCell,
    setSelectedCell,
    nextMonth,
    prevMonth,
    goToToday,
  };
}
