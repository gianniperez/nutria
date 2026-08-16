"use client";

import { WarningCircle } from "@phosphor-icons/react";
import { Modal } from "../Modal";
import { Button } from "../Button";
import type { ConfirmModalProps } from "./ConfirmModal.types";

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const iconColors = {
    danger: "text-menstrual bg-menstrual-light",
    primary: "text-primary-text bg-primary-light",
    accent: "text-accent-dark bg-accent-light",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="sm"
            isLoading={isLoading}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-3.5 ${iconColors[variant]}`}
        >
          <WarningCircle weight="duotone" className="w-7 h-7" />
        </div>

        <h3 className="font-display font-bold text-lg text-text-main mb-1.5">{title}</h3>

        <div className="text-sm text-text-muted leading-relaxed">{description}</div>
      </div>
    </Modal>
  );
}
