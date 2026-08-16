"use client";

import { Scales, Lightbulb } from "@phosphor-icons/react";
import { Card } from "@/components/Card";
import type { WeightCycleDataPoint } from "../../types";

interface WeightVsCycleChartProps {
  points: WeightCycleDataPoint[];
}

export function WeightVsCycleChart({ points }: WeightVsCycleChartProps) {
  // Datos de muestra si aún no hay suficientes registros de peso
  const displayPoints: WeightCycleDataPoint[] =
    points.length >= 3
      ? points
      : [
          { date: "01/08", weightKg: 62.1, cycleDay: 1, phase: "menstrual", phaseName: "Menstrual" },
          { date: "05/08", weightKg: 61.6, cycleDay: 5, phase: "menstrual", phaseName: "Menstrual" },
          { date: "09/08", weightKg: 61.2, cycleDay: 9, phase: "follicular", phaseName: "Folicular" },
          { date: "14/08", weightKg: 61.0, cycleDay: 14, phase: "ovulatory", phaseName: "Ovulatoria" },
          { date: "19/08", weightKg: 61.5, cycleDay: 19, phase: "luteal", phaseName: "Lútea" },
          { date: "24/08", weightKg: 62.0, cycleDay: 24, phase: "luteal", phaseName: "Lútea" },
        ];

  const minWeight = Math.min(...displayPoints.map((p) => p.weightKg)) - 0.5;
  const maxWeight = Math.max(...displayPoints.map((p) => p.weightKg)) + 0.5;
  const weightRange = maxWeight - minWeight || 1;

  return (
    <Card variant="elevated" padding="md" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary-light text-secondary-text flex items-center justify-center">
            <Scales weight="duotone" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-text-main">
              Peso vs. Fases del Ciclo
            </h3>
            <span className="text-xs text-text-muted">
              Correlación hormonal de la curva de peso
            </span>
          </div>
        </div>

        {points.length < 3 && (
          <span className="text-[10px] text-text-muted bg-surface-hover px-2 py-0.5 rounded-full">
            Datos de ejemplo
          </span>
        )}
      </div>

      {/* Gráfico Visual en Barras y Puntos de Altura */}
      <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2 bg-surface-hover/40 rounded-card border border-border/40 relative">
        {displayPoints.map((p, idx) => {
          const heightPercent = Math.max(15, Math.min(95, ((p.weightKg - minWeight) / weightRange) * 100));

          const phaseColor =
            p.phase === "menstrual"
              ? "bg-menstrual-dark"
              : p.phase === "follicular"
              ? "bg-follicular-dark"
              : p.phase === "ovulatory"
              ? "bg-ovulation-dark"
              : "bg-luteal-dark";

          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip flotante */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-surface border border-border text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-xs whitespace-nowrap z-10">
                {p.weightKg} kg ({p.phaseName})
              </div>

              {/* Barra / Punto */}
              <span className="text-[10px] font-semibold text-text-main mb-1">
                {p.weightKg}
              </span>
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full max-w-[28px] rounded-t-button transition-all ${phaseColor} opacity-80 group-hover:opacity-100`}
              />

              {/* Label de Fecha / Día */}
              <span className="text-[10px] text-text-muted mt-1 truncate">
                D{p.cycleDay}
              </span>
            </div>
          );
        })}
      </div>

      {/* Explicación Científica Anti-Culpa */}
      <div className="p-3 bg-primary-light/30 border border-primary/30 rounded-card flex items-start gap-2 text-xs text-text-main">
        <Lightbulb weight="duotone" className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px] text-text-muted">
          <strong>Retención hídrica natural:</strong> Es completamente esperado subir entre 0.5 y 1.5 kg durante la Fase Lútea tardía debido al aumento de progesterona. No es grasa, es agua intracelular.
        </p>
      </div>
    </Card>
  );
}
