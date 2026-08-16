"use client";

import { Flame, Lightning, Heartbeat } from "@phosphor-icons/react";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/Badge";
import { MacroNutrientPill } from "@/components/MacroNutrientPill";
import { NutriaMascot } from "@/components/NutriaMascot";
import type { MacroDistribution, BMICalculation } from "@/utils/nutritionCalculations";
import type { UserProfile } from "@/types/database";

interface BiometricSummaryProps {
  profile: UserProfile;
  bmr: number;
  tdee: number;
  bmiInfo: BMICalculation;
  macros: MacroDistribution;
}

export function BiometricSummary({
  profile,
  bmr,
  tdee,
  bmiInfo,
  macros,
}: BiometricSummaryProps) {
  const goalLabels: Record<UserProfile["goalType"], string> = {
    fast_loss: "Perder peso rápido (-500 kcal)",
    moderate_loss: "Perder peso moderado (-300 kcal)",
    maintenance: "Mantenimiento / Recomposición",
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Tarjeta Principal de Objetivo Calórico con Nutria Mascot */}
      <Card variant="elevated" padding="lg" className="bg-gradient-to-br from-surface to-surface-hover/60 border-border">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex flex-col text-center sm:text-left">
            <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 mb-1.5">
              <Badge variant="primary" size="sm">
                {goalLabels[profile.goalType] || "Objetivo Nutricional"}
              </Badge>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-main">
              {macros.targetCalories}{" "}
              <span className="text-base font-semibold text-text-muted">kcal / día</span>
            </h2>

            <p className="text-xs text-text-muted mt-1 max-w-sm">
              Presupuesto metabólico diario calculado para tus requerimientos y nivel de actividad.
            </p>

            {/* Pastillas de macronutrientes calculados */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
              <MacroNutrientPill type="carbs" value={macros.carbsGrams} />
              <MacroNutrientPill type="protein" value={macros.proteinGrams} />
              <MacroNutrientPill type="fat" value={macros.fatGrams} />
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <NutriaMascot state="mood4" size="lg" />
          </div>
        </div>
      </Card>

      {/* Grid de Métricas Biométricas Base */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          title="TMB (Mifflin-St Jeor)"
          value={bmr}
          unit="kcal"
          subtitle="Gasto en reposo absoluto"
          variant="primary"
          icon={<Flame weight="duotone" className="w-5 h-5" />}
        />

        <StatCard
          title="GET (Gasto Total)"
          value={tdee}
          unit="kcal"
          subtitle="TMB × Nivel de actividad"
          variant="secondary"
          icon={<Lightning weight="duotone" className="w-5 h-5" />}
        />

        <StatCard
          title="Índice de Masa (IMC)"
          value={bmiInfo.bmi}
          unit="kg/m²"
          subtitle={bmiInfo.category}
          variant="accent"
          icon={<Heartbeat weight="duotone" className="w-5 h-5" />}
        />
      </div>
    </div>
  );
}
