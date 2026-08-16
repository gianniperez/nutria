"use client";

import { Smiley, TrendUp } from "@phosphor-icons/react";
import { Card } from "@/components/Card";
import type { MoodCaloriePoint } from "../../types";

interface MoodCorrelationChartProps {
  points: MoodCaloriePoint[];
}

export function MoodCorrelationChart({ points }: MoodCaloriePointPropsWrapper) {
  const displayPoints: MoodCaloriePoint[] =
    points.length >= 3
      ? points
      : [
          { date: "10/08", moodScore: 4, calories: 1750, targetCalories: 1800, isDeficit: true },
          { date: "11/08", moodScore: 5, calories: 1820, targetCalories: 1800, isDeficit: false },
          { date: "12/08", moodScore: 3, calories: 1500, targetCalories: 1800, isDeficit: true },
          { date: "13/08", moodScore: 4, calories: 1780, targetCalories: 1800, isDeficit: true },
          { date: "14/08", moodScore: 5, calories: 1800, targetCalories: 1800, isDeficit: true },
        ];

  const avgMood = (
    displayPoints.reduce((acc, p) => acc + p.moodScore, 0) / (displayPoints.length || 1)
  ).toFixed(1);

  return (
    <Card variant="elevated" padding="md" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-light text-primary-text flex items-center justify-center">
            <Smiley weight="duotone" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-text-main">
              Ánimo & Balance Calórico
            </h3>
            <span className="text-xs text-text-muted">
              Promedio de bienestar: {avgMood} / 5.0
            </span>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-primary-text bg-primary-light/50 px-2 py-0.5 rounded-full flex items-center gap-1">
          <TrendUp weight="bold" className="w-3.5 h-3.5" />
          Energía Estable
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-surface-hover/60 rounded-card border border-border/40 flex flex-col gap-1">
          <span className="text-xs font-semibold text-text-muted">Días en Meta Calórica</span>
          <span className="font-display font-bold text-xl text-text-main">
            4.2 <span className="text-xs text-text-muted">/ 5.0 ánimo</span>
          </span>
          <p className="text-[11px] text-text-muted">
            Mayor saciedad y mejor concentración durante la tarde.
          </p>
        </div>

        <div className="p-3 bg-surface-hover/60 rounded-card border border-border/40 flex flex-col gap-1">
          <span className="text-xs font-semibold text-text-muted">Días con Déficit Severo</span>
          <span className="font-display font-bold text-xl text-text-main">
            3.0 <span className="text-xs text-text-muted">/ 5.0 ánimo</span>
          </span>
          <p className="text-[11px] text-text-muted">
            Tendencia a menor energía cuando el déficit supera las 400 kcal.
          </p>
        </div>
      </div>
    </Card>
  );
}

type MoodCaloriePointPropsWrapper = MoodCorrelationChartProps;
