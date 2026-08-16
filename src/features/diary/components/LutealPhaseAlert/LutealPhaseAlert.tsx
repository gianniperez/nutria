"use client";

import { Sparkle, Moon, Check } from "@phosphor-icons/react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import type { CyclePhaseInfo } from "@/utils/menstrualCycleCalculations";

interface LutealPhaseAlertProps {
  cycleInfo: CyclePhaseInfo;
  isApplied: boolean;
  onApply: (amount: number) => void;
  onRevert: () => void;
}

export function LutealPhaseAlert({
  cycleInfo,
  isApplied,
  onApply,
  onRevert,
}: LutealPhaseAlertProps) {
  if (!cycleInfo.isLutealAlertActive) return null;

  return (
    <Card
      variant="accent"
      padding="md"
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-accent-light/40 to-surface border-accent/40"
    >
      <div className="flex items-start gap-2.5 flex-1">
        <div className="w-8 h-8 rounded-full bg-accent-light text-accent-dark flex items-center justify-center shrink-0 mt-0.5">
          <Moon weight="duotone" className="w-5 h-5" />
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-xs text-accent-dark flex items-center gap-1">
            <Sparkle weight="duotone" className="w-3.5 h-3.5" />
            Fase Lútea Activa (Día {cycleInfo.cycleDay} de {cycleInfo.totalCycleDays})
          </span>
          <p className="text-xs text-text-main mt-0.5 leading-relaxed">
            Tu cuerpo quema ~150-200 kcal más hoy. ¿Deseas aplicar un ajuste calórico temporal a tu meta?
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {isApplied ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-dark bg-accent-light/60 px-2.5 py-1 rounded-full">
              <Check weight="bold" className="w-3.5 h-3.5" />
              +150 kcal aplicadas
            </span>
            <Button variant="ghost" size="sm" onClick={onRevert}>
              Quitar
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="accent"
              size="sm"
              onClick={() => onApply(150)}
            >
              Aplicar +150 kcal
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
