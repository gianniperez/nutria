import type { ReactNode } from "react";

export type ToastVariant = "info" | "success" | "warning" | "menstrual" | "love";

export interface ToastNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: ReactNode;
  variant?: ToastVariant;
  actionText?: string;
  onAction?: () => void;
  autoHideDuration?: number; // ms, default 5000 (0 para no auto-cerrar)
}
