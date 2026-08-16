"use client";

import { useState } from "react";
import { Ruler, Plus, Trash } from "@phosphor-icons/react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { NumberInput } from "@/components/NumberInput";
import { IconButton } from "@/components/IconButton";
import { Modal } from "@/components/Modal";
import type { AnthropometricEntry } from "@/types/database";

interface AnthropometryTrackerProps {
  history: AnthropometricEntry[];
  onAddMeasurement: (data: {
    date: string;
    waistCm?: number;
    hipCm?: number;
    chestCm?: number;
    thighCm?: number;
    armCm?: number;
    weightKg?: number;
    notes?: string;
  }) => Promise<unknown>;
  onDeleteMeasurement: (id: string) => Promise<void>;
}

export function AnthropometryTracker({
  history,
  onAddMeasurement,
  onDeleteMeasurement,
}: AnthropometryTrackerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [waist, setWaist] = useState<number>(70);
  const [hip, setHip] = useState<number>(95);
  const [chest, setChest] = useState<number>(88);
  const [thigh, setThigh] = useState<number>(54);
  const [weight, setWeight] = useState<number>(62);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddMeasurement({
        date: new Date().toISOString().split("T")[0],
        waistCm: waist,
        hipCm: hip,
        chestCm: chest,
        thighCm: thigh,
        weightKg: weight,
      });
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card variant="elevated" padding="md" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent-light text-accent-dark flex items-center justify-center">
              <Ruler weight="duotone" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-text-main">
                Medidas Corporales (Antropometría)
              </h3>
              <span className="text-xs text-text-muted">
                Evolución de contornos en cm
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus weight="bold" className="w-3.5 h-3.5" />}
            onClick={() => setIsModalOpen(true)}
          >
            Nueva Medición
          </Button>
        </div>

        {history.length > 0 ? (
          <div className="flex flex-col gap-2">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-surface-hover/60 rounded-card border border-border/40 text-xs"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-text-main">{entry.date}</span>
                  <div className="flex flex-wrap gap-2.5 text-text-muted">
                    {entry.waistCm && <span>Cintura: <strong>{entry.waistCm} cm</strong></span>}
                    {entry.hipCm && <span>Cadera: <strong>{entry.hipCm} cm</strong></span>}
                    {entry.thighCm && <span>Muslo: <strong>{entry.thighCm} cm</strong></span>}
                    {entry.weightKg && <span>Peso: <strong>{entry.weightKg} kg</strong></span>}
                  </div>
                </div>

                <IconButton
                  icon={<Trash weight="bold" className="w-3.5 h-3.5 text-text-muted hover:text-menstrual" />}
                  aria-label="Eliminar medición"
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteMeasurement(entry.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-surface-hover/40 rounded-card border border-border/40 text-center text-xs text-text-muted">
            Aún no has registrado medidas corporales. ¡Toma tu cinta métrica y registra tu punto de partida!
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Medidas Corporales"
        description="Ingresa tus medidas actuales en centímetros."
        maxWidth="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" isLoading={isSubmitting} onClick={handleSubmit}>
              Guardar Medición
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <NumberInput label="Cintura" value={waist} onChange={setWaist} min={40} max={180} step={0.5} unit="cm" />
          <NumberInput label="Cadera" value={hip} onChange={setHip} min={50} max={200} step={0.5} unit="cm" />
          <NumberInput label="Pecho / Busto" value={chest} onChange={setChest} min={50} max={180} step={0.5} unit="cm" />
          <NumberInput label="Muslo" value={thigh} onChange={setThigh} min={30} max={120} step={0.5} unit="cm" />
          <div className="col-span-1 sm:col-span-2">
            <NumberInput label="Peso Corporal" value={weight} onChange={setWeight} min={30} max={250} step={0.1} unit="kg" />
          </div>
        </form>
      </Modal>
    </>
  );
}
