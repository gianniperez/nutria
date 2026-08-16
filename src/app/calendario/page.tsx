"use client";

import { CaretLeft, CaretRight, Calendar } from "@phosphor-icons/react";
import {
  useCalendar,
  MonthlyCalendarGrid,
  DayDetailModal,
  CycleLegend,
} from "@/features/calendar";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { Card } from "@/components/Card";

export default function CalendarioPage() {
  const {
    monthTitle,
    monthCells,
    selectedCell,
    setSelectedCell,
    nextMonth,
    prevMonth,
    goToToday,
  } = useCalendar();

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-5 pb-24">
      {/* Header con Navegación de Mes */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-primary-light text-primary-text flex items-center justify-center shrink-0">
            <Calendar weight="duotone" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-main">
              {monthTitle}
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Sincronización de fases menstruales y adherencia nutricional.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoy
          </Button>

          <IconButton
            icon={<CaretLeft weight="bold" className="w-4 h-4" />}
            aria-label="Mes anterior"
            size="sm"
            variant="outline"
            onClick={prevMonth}
          />

          <IconButton
            icon={<CaretRight weight="bold" className="w-4 h-4" />}
            aria-label="Mes siguiente"
            size="sm"
            variant="outline"
            onClick={nextMonth}
          />
        </div>
      </header>

      {/* Leyenda de Fases del Ciclo */}
      <CycleLegend />

      {/* Cuadrícula Mensual */}
      <Card variant="elevated" padding="md" className="overflow-hidden">
        <MonthlyCalendarGrid
          cells={monthCells}
          onSelectDay={(cell) => setSelectedCell(cell)}
        />
      </Card>

      {/* Modal de Detalle al Clickear un Día */}
      <DayDetailModal
        cell={selectedCell}
        onClose={() => setSelectedCell(null)}
      />
    </main>
  );
}
