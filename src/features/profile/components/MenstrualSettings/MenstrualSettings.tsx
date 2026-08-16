"use client";

import { Drop, Sparkle, Calendar } from "@phosphor-icons/react";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { NumberInput } from "@/components/NumberInput";
import { getCyclePhaseInfo } from "@/utils/menstrualCycleCalculations";
import type { UserProfile } from "@/types/database";

interface MenstrualSettingsProps {
  cycleLengthDays: number;
  periodDurationDays: number;
  lastPeriodDate?: string;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

export function MenstrualSettings({
  cycleLengthDays,
  periodDurationDays,
  lastPeriodDate = "2026-08-01",
  onUpdate,
}: MenstrualSettingsProps) {
  const safeCycle = cycleLengthDays || 28;
  const safePeriod = periodDurationDays || 5;
  const safeLastPeriodDate = lastPeriodDate || "2026-08-01";
  const ovulationDay = safeCycle - 14;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayCycleInfo = getCyclePhaseInfo(
    todayStr,
    safeLastPeriodDate,
    safeCycle,
    safePeriod
  );

  return (
    <Card variant="elevated" padding="md" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-menstrual-light text-menstrual-dark flex items-center justify-center">
            <Drop weight="duotone" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-text-main">
              Ciclo Menstrual & Salud Hormonal
            </h3>
            <p className="text-xs text-text-muted">
              Configura tus duraciones y fecha real de sangrado para sincronizar el calendario.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-menstrual-dark bg-menstrual-light/60 px-2.5 py-1 rounded-full">
          Hoy: Día {todayCycleInfo.cycleDay} ({todayCycleInfo.phaseName})
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          type="date"
          label="Inicio del último período"
          value={safeLastPeriodDate}
          onChange={(e) => onUpdate({ lastPeriodDate: e.target.value })}
          leftIcon={<Calendar weight="duotone" className="w-4 h-4 text-menstrual-dark" />}
        />

        <NumberInput
          label="Duración promedio del ciclo"
          value={safeCycle}
          onChange={(val) => onUpdate({ cycleLengthDays: val })}
          min={24}
          max={35}
          step={1}
          unit="días"
        />

        <NumberInput
          label="Duración del sangrado"
          value={safePeriod}
          onChange={(val) => onUpdate({ periodDurationDays: val })}
          min={3}
          max={7}
          step={1}
          unit="días"
        />
      </div>

      {/* Vista previa de las 4 fases calculadas */}
      <div className="flex flex-col gap-2 p-3 bg-surface-hover/70 rounded-card border border-border/60">
        <span className="text-xs font-semibold text-text-main flex items-center gap-1.5">
          <Sparkle weight="duotone" className="w-4 h-4 text-primary" />
          Tus 4 Fases Proyectadas ({safeCycle} días):
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 rounded-button bg-menstrual-light/50 border border-menstrual/30">
            <span className="font-semibold text-menstrual-dark block">Menstrual</span>
            <span className="text-text-muted text-[11px]">Días 1 a {safePeriod}</span>
          </div>

          <div className="p-2 rounded-button bg-secondary-light/50 border border-secondary/30">
            <span className="font-semibold text-secondary-text block">Folicular</span>
            <span className="text-text-muted text-[11px]">
              Días {safePeriod + 1} a {ovulationDay - 2}
            </span>
          </div>

          <div className="p-2 rounded-button bg-primary-light/50 border border-primary/30">
            <span className="font-semibold text-primary-text block">Ovulatoria</span>
            <span className="text-text-muted text-[11px]">
              Días {ovulationDay - 1} a {ovulationDay + 1}
            </span>
          </div>

          <div className="p-2 rounded-button bg-accent-light/50 border border-accent/30">
            <span className="font-semibold text-accent-dark block">Lútea</span>
            <span className="text-text-muted text-[11px]">
              Días {ovulationDay + 2} a {safeCycle}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
