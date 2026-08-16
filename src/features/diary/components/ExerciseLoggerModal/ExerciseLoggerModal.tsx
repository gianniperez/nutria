"use client";

import { useState } from "react";
import {
  Barbell,
  Lightning,
  PersonSimpleWalk,
  PersonSimpleRun,
  FlowerLotus,
  MusicNotes,
  Flame,
  CheckCircle,
} from "@phosphor-icons/react";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { NumberInput } from "@/components/NumberInput";
import { Button } from "@/components/Button";
import { useProfile } from "@/features/profile";
import {
  EXERCISE_PRESETS,
  calculateExerciseCalories,
  type PresetExercise,
} from "@/utils/nutritionCalculations";

const PRESET_ICONS: Record<string, React.ReactNode> = {
  Pesas: <Barbell weight="duotone" className="w-4 h-4 text-primary-text" />,
  "Cardio / HIIT": <Lightning weight="duotone" className="w-4 h-4 text-accent-dark" />,
  "Caminata 3km/h": <PersonSimpleWalk weight="duotone" className="w-4 h-4 text-secondary-text" />,
  Running: <PersonSimpleRun weight="duotone" className="w-4 h-4 text-primary-text" />,
  Pilates: <FlowerLotus weight="duotone" className="w-4 h-4 text-secondary-text" />,
  Baile: <MusicNotes weight="duotone" className="w-4 h-4 text-accent-dark" />,
};

interface ExerciseLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogExercise: (
    name: string,
    durationMinutes: number,
    baseCalories: number,
    baseDurationMinutes: number
  ) => Promise<void>;
  userWeightKg?: number;
}

export function ExerciseLoggerModal({
  isOpen,
  onClose,
  onLogExercise,
  userWeightKg,
}: ExerciseLoggerModalProps) {
  const { profile } = useProfile();
  const weightKg = userWeightKg || profile?.weightKg || 60;

  const [exerciseName, setExerciseName] = useState(EXERCISE_PRESETS[0].name);
  const [currentMet, setCurrentMet] = useState(EXERCISE_PRESETS[0].met);
  const [durationMinutes, setDurationMinutes] = useState(EXERCISE_PRESETS[0].defaultDurationMinutes);
  const [isLogging, setIsLogging] = useState(false);

  const handleSelectPreset = (preset: PresetExercise) => {
    setExerciseName(preset.name);
    setCurrentMet(preset.met);
    setDurationMinutes(preset.defaultDurationMinutes);
  };

  // Cálculo científico: kcal = MET * peso (kg) * (minutos / 60)
  const calculatedCalories = calculateExerciseCalories(currentMet, weightKg, durationMinutes);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName.trim()) return;

    setIsLogging(true);
    try {
      await onLogExercise(
        exerciseName,
        durationMinutes,
        calculatedCalories,
        durationMinutes
      );
      onClose();
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Barbell weight="duotone" className="w-5 h-5 text-secondary-text" />
          <span>Registrar Ejercicio</span>
        </div>
      }
      description="El gasto energético se calcula según tu peso actual y la intensidad metabólica (MET)."
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-between gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLogging}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isLogging}
            leftIcon={<CheckCircle weight="bold" className="w-4 h-4" />}
            onClick={handleSubmit}
          >
            Registrar (+{calculatedCalories} kcal)
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Presets Solicitados */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Actividad Realizada
            </span>
            <span className="text-[11px] text-text-muted font-medium">
              Base: <strong>{weightKg} kg</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {EXERCISE_PRESETS.map((preset) => {
              const isSelected = exerciseName === preset.name;
              const icon = PRESET_ICONS[preset.name] || (
                <Flame weight="duotone" className="w-4 h-4 text-accent-dark" />
              );

              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`flex flex-col p-2.5 rounded-card border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-secondary-light/40 border-secondary-dark ring-1 ring-secondary-dark/60 shadow-2xs"
                      : "bg-surface border-border hover:bg-surface-hover"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {icon}
                    <span className="font-semibold text-xs text-text-main truncate">
                      {preset.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-text-muted line-clamp-1">
                    {preset.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nombre personalizado y Duración */}
        <Input
          label="Nombre de la Actividad"
          value={exerciseName}
          onChange={(e) => {
            setExerciseName(e.target.value);
            const matched = EXERCISE_PRESETS.find((p) => p.name.toLowerCase() === e.target.value.toLowerCase());
            if (matched) setCurrentMet(matched.met);
          }}
          placeholder="Ej. Pesas, Baile, Cardio..."
          required
        />

        <NumberInput
          label="Duración del Entrenamiento"
          value={durationMinutes}
          onChange={setDurationMinutes}
          min={5}
          max={600}
          step={5}
          unit="min"
        />

        {/* Resumen de Quema Calórica */}
        <div className="p-3.5 bg-gradient-to-br from-surface to-surface-hover/80 rounded-card border border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-accent-light/50 text-accent-dark flex items-center justify-center shrink-0">
              <Flame weight="duotone" className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-text-main">Gasto Energético Proyectado</span>
              <span className="text-[11px] text-text-muted">
                {currentMet} METs • {durationMinutes} min • {weightKg} kg
              </span>
            </div>
          </div>

          <span className="font-display font-bold text-xl text-accent-dark">
            +{calculatedCalories} kcal
          </span>
        </div>
      </form>
    </Modal>
  );
}

