"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Trash, Star, ImageSquare } from "@phosphor-icons/react";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { NumberInput } from "@/components/NumberInput";
import { Button } from "@/components/Button";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { ConfirmModal } from "@/components/ConfirmModal";
import { compressImageToWebP } from "@/utils/imageCompression";
import type { Ingredient, PortionUnit } from "@/types/database";
import type { FoodFormData } from "../../types";

interface FoodFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FoodFormData, existingId?: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  editingFood?: Ingredient | null;
}

const DEFAULT_FORM: FoodFormData = {
  name: "",
  brand: "",
  portionGrams: 100,
  portionUnit: "g",
  calories: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
  fiberG: 0,
  isFavorite: false,
  imageUrl: "",
};

export function FoodFormModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingFood,
}: FoodFormModalProps) {
  const [formData, setFormData] = useState<FoodFormData>(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingFood) {
      setFormData({
        name: editingFood.name,
        brand: editingFood.brand || "",
        portionGrams: editingFood.portionGrams,
        portionUnit: editingFood.portionUnit,
        calories: editingFood.calories,
        proteinG: editingFood.proteinG,
        carbsG: editingFood.carbsG,
        fatG: editingFood.fatG,
        fiberG: editingFood.fiberG || 0,
        isFavorite: editingFood.isFavorite,
        imageUrl: editingFood.imageUrl || "",
      });
    } else {
      setFormData(DEFAULT_FORM);
    }
  }, [editingFood, isOpen]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const compressedBase64 = await compressImageToWebP(file, 400, 0.82);
      setFormData((prev) => ({ ...prev, imageUrl: compressedBase64 }));
    } catch (err) {
      console.error("Error comprimiendo imagen:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData, editingFood?.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (editingFood && onDelete) {
      await onDelete(editingFood.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={editingFood ? "Editar Alimento" : "Nuevo Alimento"}
        description="Ingresa los valores nutricionales por porción base (ej. 100g)."
        maxWidth="md"
        footer={
          <div className="flex items-center justify-between w-full">
            {editingFood && onDelete ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-menstrual hover:bg-menstrual-light/40"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash weight="bold" className="w-4 h-4 mr-1.5" />
                Eliminar
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                onClick={handleSubmit}
                disabled={!formData.name.trim()}
              >
                Guardar
              </Button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Subida de Imagen con Compresión WebP */}
          <div className="flex items-center gap-3 p-3 bg-surface-hover/70 rounded-card border border-border/60">
            <div className="relative w-16 h-16 rounded-button overflow-hidden bg-surface border border-border shrink-0 flex items-center justify-center">
              {formData.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.imageUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageSquare weight="duotone" className="w-8 h-8 text-text-muted/60" />
              )}
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <span className="text-xs font-semibold text-text-main">Foto del Alimento</span>
              <p className="text-[11px] text-text-muted">
                Comprimida en WebP automáticamente en tu dispositivo.
              </p>

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  isLoading={isCompressing}
                  leftIcon={<Camera weight="bold" className="w-3.5 h-3.5" />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.imageUrl ? "Cambiar foto" : "Subir foto"}
                </Button>

                {formData.imageUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-menstrual"
                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                  >
                    Quitar
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Nombre y Marca */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nombre del Alimento *"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ej. Pechuga de pollo, Avena..."
              required
            />

            <Input
              label="Marca / Variedad (Opcional)"
              value={formData.brand}
              onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
              placeholder="Ej. Quáker, Casero, La Serenísima..."
            />
          </div>

          {/* Porción Base */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberInput
              label="Cantidad porción base"
              value={formData.portionGrams}
              onChange={(val) => setFormData((prev) => ({ ...prev, portionGrams: val }))}
              min={1}
              max={2000}
              step={10}
              unit={formData.portionUnit}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Unidad de Medida
              </label>
              <select
                value={formData.portionUnit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    portionUnit: e.target.value as PortionUnit,
                  }))
                }
                className="w-full bg-surface text-text-main text-sm rounded-button border border-border px-3.5 py-2.5 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="g">Gramos (g)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="unit">Unidad / Porción</option>
              </select>
            </div>
          </div>

          {/* Valores Nutricionales por Porción Base */}
          <div className="p-3 bg-surface-hover/50 rounded-card border border-border/60 flex flex-col gap-3">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Información Nutricional por {formData.portionGrams}
              {formData.portionUnit}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <NumberInput
                label="Calorías"
                value={formData.calories}
                onChange={(val) => setFormData((prev) => ({ ...prev, calories: val }))}
                min={0}
                max={5000}
                step={5}
                unit="kcal"
              />

              <NumberInput
                label="Proteína"
                value={formData.proteinG}
                onChange={(val) => setFormData((prev) => ({ ...prev, proteinG: val }))}
                min={0}
                max={500}
                step={1}
                unit="g"
              />

              <NumberInput
                label="Carbohidratos"
                value={formData.carbsG}
                onChange={(val) => setFormData((prev) => ({ ...prev, carbsG: val }))}
                min={0}
                max={500}
                step={1}
                unit="g"
              />

              <NumberInput
                label="Grasas Totales"
                value={formData.fatG}
                onChange={(val) => setFormData((prev) => ({ ...prev, fatG: val }))}
                min={0}
                max={500}
                step={1}
                unit="g"
              />
            </div>
          </div>

          {/* Favorito */}
          <ToggleSwitch
            checked={formData.isFavorite}
            onChange={(checked) => setFormData((prev) => ({ ...prev, isFavorite: checked }))}
            label={
              <span className="flex items-center gap-1.5">
                <Star
                  weight={formData.isFavorite ? "fill" : "regular"}
                  className={formData.isFavorite ? "text-[#F4A261]" : "text-text-muted"}
                />
                Alimento Favorito
              </span>
            }
            description="Aparecerá fijado arriba de todo en las búsquedas del diario."
          />
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="¿Eliminar este alimento?"
        description={`Se eliminará "${editingFood?.name}" de tu inventario.`}
        confirmText="Eliminar Alimento"
      />
    </>
  );
}
