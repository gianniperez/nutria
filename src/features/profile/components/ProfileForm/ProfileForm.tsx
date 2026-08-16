"use client";

import { useState, useEffect } from "react";
import { User, SlidersHorizontal, Barbell, Calendar, Info } from "@phosphor-icons/react";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { NumberInput } from "@/components/NumberInput";
import { SegmentedControl, type SegmentOption } from "@/components/SegmentedControl";
import { Button } from "@/components/Button";
import type { UserProfile } from "@/types/database";

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => Promise<void>;
}

export function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sincronizar estado del formulario cuando el perfil cambia desde la nube o el padre
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleFieldChange = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaveSuccess(false);
  };

  const handleGoalTypeChange = (newGoal: UserProfile["goalType"]) => {
    let newDeficit = formData.customDeficitKcal;
    if (newGoal === "fast_loss") {
      if (!newDeficit || newDeficit < 300 || newDeficit > 500) {
        newDeficit = 400;
      }
    } else if (newGoal === "moderate_loss") {
      if (!newDeficit || newDeficit < 100 || newDeficit > 300) {
        newDeficit = 200;
      }
    } else if (newGoal === "maintenance") {
      newDeficit = 0;
    }

    setFormData((prev) => ({
      ...prev,
      goalType: newGoal,
      customDeficitKcal: newDeficit,
    }));
    setSaveSuccess(false);
  };

  const handleDeficitChange = (newDeficit: number) => {
    let targetGoal: UserProfile["goalType"] = formData.goalType;
    if (newDeficit <= 0) {
      targetGoal = "maintenance";
    } else if (newDeficit < 300) {
      targetGoal = "moderate_loss";
    } else {
      targetGoal = "fast_loss";
    }

    setFormData((prev) => ({
      ...prev,
      customDeficitKcal: newDeficit,
      goalType: targetGoal,
    }));
    setSaveSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const activityOptions: SegmentOption<UserProfile["activityLevel"]>[] = [
    { value: "sedentary", label: "Sedentario (1.2)" },
    { value: "light", label: "Ligero (1.37)" },
    { value: "moderate", label: "Moderado (1.55)" },
    { value: "intense", label: "Intenso (1.72)" },
  ];

  const goalOptions: SegmentOption<UserProfile["goalType"]>[] = [
    { value: "moderate_loss", label: "Bajar Moderado (100-300)" },
    { value: "fast_loss", label: "Bajar Rápido (300-500)" },
    { value: "maintenance", label: "Mantener Peso" },
  ];

  const macroModeOptions: SegmentOption<UserProfile["macroCalculationMode"]>[] = [
    { value: "body_weight", label: "Por Peso (g/kg)" },
    { value: "percentage", label: "Porcentual (%)" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {/* 1. Datos Biométricos Base */}
      <Card variant="elevated" padding="md" className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-light text-primary-text flex items-center justify-center">
            <User weight="duotone" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-text-main">
              Medidas Corporales & Biometría
            </h3>
            <p className="text-xs text-text-muted">
              Datos para calcular tu gasto calórico basal exacto con Mifflin-St Jeor.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberInput
            label="Peso Actual"
            value={formData.weightKg}
            onChange={(val) => handleFieldChange("weightKg", val)}
            min={30}
            max={250}
            step={0.1}
            unit="kg"
          />

          <NumberInput
            label="Altura"
            value={formData.heightCm}
            onChange={(val) => handleFieldChange("heightCm", val)}
            min={100}
            max={230}
            step={0.5}
            unit="cm"
          />

          <Input
            type="date"
            label="Fecha de Nacimiento"
            value={formData.birthDate}
            onChange={(e) => handleFieldChange("birthDate", e.target.value)}
            leftIcon={<Calendar weight="duotone" className="w-4 h-4" />}
          />
        </div>
      </Card>

      {/* 2. Nivel de Actividad y Meta Calórica */}
      <Card variant="elevated" padding="md" className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary-light text-secondary-text flex items-center justify-center">
            <Barbell weight="duotone" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-text-main">
              Actividad & Objetivo
            </h3>
            <p className="text-xs text-text-muted">
              Determina el multiplicador de gasto energético (GET) y el déficit programado.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Nivel de Actividad Física Semanal
          </label>
          <SegmentedControl
            name="activity-level"
            options={activityOptions}
            value={formData.activityLevel}
            onChange={(val) => handleFieldChange("activityLevel", val)}
          />
        </div>

        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Objetivo de Alimentación
          </label>
          <SegmentedControl
            name="goal-type"
            options={goalOptions}
            value={formData.goalType}
            onChange={handleGoalTypeChange}
          />
        </div>

        {formData.goalType !== "maintenance" ? (
          <div className="mt-2 flex flex-col gap-1.5">
            <NumberInput
              label="Déficit Calórico Diario Deseado"
              value={formData.customDeficitKcal}
              onChange={handleDeficitChange}
              min={formData.goalType === "moderate_loss" ? 50 : 300}
              max={formData.goalType === "moderate_loss" ? 350 : 600}
              step={25}
              unit="kcal"
            />
            <p className="text-[11px] text-text-muted flex items-center gap-1">
              <Info weight="bold" className="w-3.5 h-3.5 text-primary" />
              {formData.goalType === "moderate_loss"
                ? "Rango recomendado: 100 a 300 kcal/día (pérdida suave y sostenible)."
                : "Rango recomendado: 300 a 500 kcal/día (pérdida más rápida y agresiva)."}
            </p>
          </div>
        ) : (
          <div className="p-2.5 rounded-lg bg-surface border border-border text-xs text-text-muted flex items-center gap-2">
            <Info weight="fill" className="w-4 h-4 text-secondary-dark shrink-0" />
            <span>
              <strong>Modo Mantenimiento:</strong> Sin déficit calórico (consumo equivalente a tu gasto diario estimado).
            </span>
          </div>
        )}
      </Card>

      {/* 3. Distribución de Macronutrientes */}
      <Card variant="elevated" padding="md" className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent-light text-accent-dark flex items-center justify-center">
            <SlidersHorizontal weight="duotone" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-text-main">
              Cálculo de Macronutrientes
            </h3>
            <p className="text-xs text-text-muted">
              Elige cómo distribuir tus gramos de proteína, grasas y carbohidratos.
            </p>
          </div>
        </div>

        <SegmentedControl
          name="macro-mode"
          options={macroModeOptions}
          value={formData.macroCalculationMode}
          onChange={(val) => handleFieldChange("macroCalculationMode", val)}
        />

        {formData.macroCalculationMode === "body_weight" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <NumberInput
              label="Proteína por kg de peso (Default: 2.0g)"
              value={formData.proteinGramsPerKg || 2.0}
              onChange={(val) => handleFieldChange("proteinGramsPerKg", val)}
              min={1.2}
              max={3.0}
              step={0.1}
              unit="g/kg"
            />

            <NumberInput
              label="Grasas por kg de peso (Default: 0.9g)"
              value={formData.fatGramsPerKg || 0.9}
              onChange={(val) => handleFieldChange("fatGramsPerKg", val)}
              min={0.5}
              max={1.8}
              step={0.05}
              unit="g/kg"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <NumberInput
              label="% Proteínas (Default: 30%)"
              value={formData.macroPercentages?.protein || 30}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  macroPercentages: {
                    carbs: prev.macroPercentages?.carbs || 45,
                    protein: val,
                    fat: prev.macroPercentages?.fat || 25,
                  },
                }))
              }
              min={15}
              max={50}
              step={5}
              unit="%"
            />

            <NumberInput
              label="% Grasas (Default: 25%)"
              value={formData.macroPercentages?.fat || 25}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  macroPercentages: {
                    carbs: prev.macroPercentages?.carbs || 45,
                    protein: prev.macroPercentages?.protein || 30,
                    fat: val,
                  },
                }))
              }
              min={15}
              max={50}
              step={5}
              unit="%"
            />

            <NumberInput
              label="% Carbohidratos (Default: 45%)"
              value={formData.macroPercentages?.carbs || 45}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  macroPercentages: {
                    carbs: val,
                    protein: prev.macroPercentages?.protein || 30,
                    fat: prev.macroPercentages?.fat || 25,
                  },
                }))
              }
              min={15}
              max={70}
              step={5}
              unit="%"
            />
          </div>
        )}
      </Card>

      {/* Botón Guardar Cambios */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {saveSuccess ? (
          <div className="text-sm font-medium text-secondary-dark flex items-center gap-1.5 animate-fadeIn">
            ✓ ¡Tus ajustes biométricos se guardaron y sincronizaron con éxito!
          </div>
        ) : (
          <div className="text-xs text-text-muted">
            Los cambios se guardan localmente y se actualizan en la nube.
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSaving}
          className="w-full sm:w-auto min-w-[180px]"
        >
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
