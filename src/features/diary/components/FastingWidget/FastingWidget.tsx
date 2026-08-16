"use client";

import { useState, useEffect } from "react";
import { Timer, Play, Stop, Sparkle } from "@phosphor-icons/react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { CircularProgress } from "@/components/CircularProgress";
import type { FastingSession } from "@/types/database";

interface FastingWidgetProps {
  session?: FastingSession;
  onStart: (targetHours: number) => Promise<void>;
  onEnd: () => Promise<void>;
}

export function FastingWidget({ session, onStart, onEnd }: FastingWidgetProps) {
  const [selectedTargetHours, setSelectedTargetHours] = useState<number>(16);
  const [now, setNow] = useState<number>(Date.now());
  const [isProcessing, setIsProcessing] = useState(false);

  // Actualizar temporizador cada minuto
  useEffect(() => {
    if (session?.isActive) {
      const interval = setInterval(() => {
        setNow(Date.now());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [session?.isActive]);

  const isActive = Boolean(session?.isActive);
  const startTime = session?.startTime || Date.now();
  const targetHours = session?.targetHours || selectedTargetHours;

  const elapsedMs = Math.max(0, now - startTime);
  const elapsedMinutesTotal = Math.floor(elapsedMs / 60000);
  const elapsedHours = Math.floor(elapsedMinutesTotal / 60);
  const elapsedMinutesRemainder = elapsedMinutesTotal % 60;

  const targetMinutes = targetHours * 60;
  const progressPercent = Math.min(100, Math.round((elapsedMinutesTotal / targetMinutes) * 100));

  // Fase metabólica actual
  let metabolicPhase = "Digestión inicial";
  let metabolicBadgeVariant: "neutral" | "primary" | "secondary" | "accent" = "neutral";

  if (elapsedHours >= 16) {
    metabolicPhase = "Autofagia & Cetosis Leve";
    metabolicBadgeVariant = "accent";
  } else if (elapsedHours >= 12) {
    metabolicPhase = "Quema Acelerada de Grasa";
    metabolicBadgeVariant = "secondary";
  } else if (elapsedHours >= 4) {
    metabolicPhase = "Descenso de Insulina";
    metabolicBadgeVariant = "primary";
  }

  const handleStart = async () => {
    setIsProcessing(true);
    try {
      await onStart(selectedTargetHours);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnd = async () => {
    setIsProcessing(true);
    try {
      await onEnd();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card variant="elevated" padding="md" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary-light text-secondary-text flex items-center justify-center">
            <Timer weight="duotone" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-text-main">
              Ayuno Intermitente
            </h3>
            <span className="text-xs text-text-muted">
              {isActive ? `Meta: ${targetHours} horas` : "Controla tus ventanas de ayuno"}
            </span>
          </div>
        </div>

        {isActive && (
          <Badge variant={metabolicBadgeVariant} size="sm" icon={<Sparkle weight="bold" className="w-3 h-3" />}>
            {metabolicPhase}
          </Badge>
        )}
      </div>

      {isActive ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
          {/* Anillo de Progreso */}
          <div className="shrink-0">
            <CircularProgress
              value={progressPercent}
              size={130}
              strokeWidth={9}
              color="var(--color-secondary-dark)"
            >
              <span className="font-display font-bold text-xl text-text-main">
                {elapsedHours}h {elapsedMinutesRemainder}m
              </span>
              <span className="text-[11px] font-semibold text-text-muted">
                {progressPercent}% cumplido
              </span>
            </CircularProgress>
          </div>

          {/* Información y Botón de Fin */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 flex-1">
            <span className="text-xs text-text-muted leading-relaxed">
              Tu ventana de ayuno inició a las{" "}
              <strong>
                {new Date(startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </strong>
              . Tu cuerpo se encuentra en proceso de <strong>{metabolicPhase.toLowerCase()}</strong>.
            </span>

            <Button
              variant="outline"
              size="sm"
              isLoading={isProcessing}
              leftIcon={<Stop weight="fill" className="w-3.5 h-3.5 text-accent-dark" />}
              onClick={handleEnd}
              className="mt-1"
            >
              Finalizar Ayuno
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-surface-hover/50 rounded-card border border-border/40">
          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Elige tu Protocolo
            </span>
            <div className="flex items-center gap-1.5">
              {[12, 14, 16, 18].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setSelectedTargetHours(hours)}
                  className={`text-xs px-2.5 py-1 rounded-button border transition-colors cursor-pointer ${
                    selectedTargetHours === hours
                      ? "bg-secondary text-secondary-text font-semibold border-secondary-dark shadow-2xs"
                      : "bg-surface text-text-muted border-border hover:bg-surface-hover"
                  }`}
                >
                  {hours}h
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="secondary"
            size="md"
            isLoading={isProcessing}
            leftIcon={<Play weight="fill" className="w-4 h-4" />}
            onClick={handleStart}
          >
            Iniciar Ayuno ({selectedTargetHours}h)
          </Button>
        </div>
      )}
    </Card>
  );
}
