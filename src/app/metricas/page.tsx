"use client";

import { ChartLineUp } from "@phosphor-icons/react";
import {
  useAnalytics,
  HabitStreakCard,
  WeightVsCycleChart,
  MoodCorrelationChart,
  AnthropometryTracker,
} from "@/features/analytics";

export default function MetricasPage() {
  const {
    weightVsCyclePoints,
    moodCorrelationPoints,
    habitStats,
    anthropometryHistory,
    addMeasurement,
    deleteMeasurement,
  } = useAnalytics();

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6 pb-24">
      {/* Header */}
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-light text-primary-text flex items-center justify-center shrink-0">
          <ChartLineUp weight="duotone" className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-main">
            Métricas & Progreso
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            Correlaciones de peso hormonal, racha de hábitos y mediciones
            corporales.
          </p>
        </div>
      </header>

      {/* 1. Racha de Hábitos */}
      <HabitStreakCard stats={habitStats} />

      {/* 2. Gráfico Peso vs Ciclo Menstrual */}
      <WeightVsCycleChart points={weightVsCyclePoints} />

      {/* 3. Correlación de Ánimo y Déficit */}
      <MoodCorrelationChart points={moodCorrelationPoints} />

      {/* 4. Tracker Antropométrico */}
      <AnthropometryTracker
        history={anthropometryHistory}
        onAddMeasurement={addMeasurement}
        onDeleteMeasurement={deleteMeasurement}
      />
    </main>
  );
}
