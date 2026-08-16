"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Info,
  Warning,
  Heart,
  Drop,
  X,
} from "@phosphor-icons/react";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import type { ToastNotificationProps, ToastVariant } from "./ToastNotification.types";

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  info: <Info weight="duotone" className="w-5 h-5 text-primary-text" />,
  success: <CheckCircle weight="duotone" className="w-5 h-5 text-secondary-text" />,
  warning: <Warning weight="duotone" className="w-5 h-5 text-accent-dark" />,
  menstrual: <Drop weight="duotone" className="w-5 h-5 text-menstrual-dark" />,
  love: <Heart weight="duotone" className="w-5 h-5 text-love-dark" />,
};

const variantStyles: Record<ToastVariant, string> = {
  info: "bg-surface border-primary/40 shadow-lg",
  success: "bg-surface border-secondary/40 shadow-lg",
  warning: "bg-surface border-accent/40 shadow-lg",
  menstrual: "bg-menstrual-light/80 border-menstrual/50 shadow-lg",
  love: "bg-love-light/80 border-love/50 shadow-lg",
};

export function ToastNotification({
  isOpen,
  onClose,
  title,
  message,
  variant = "info",
  actionText,
  onAction,
  autoHideDuration = 5000,
}: ToastNotificationProps) {
  useEffect(() => {
    if (isOpen && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoHideDuration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className={`p-4 rounded-card border ${variantStyles[variant]} flex items-start gap-3`}
          >
            <div className="shrink-0 mt-0.5">{variantIcons[variant]}</div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-text-main leading-snug">{title}</h4>
              {message && (
                <div className="text-xs text-text-muted mt-0.5 leading-relaxed">{message}</div>
              )}
              {actionText && onAction && (
                <div className="mt-2.5">
                  <Button
                    variant={variant === "menstrual" ? "menstrual" : "primary"}
                    size="sm"
                    onClick={() => {
                      onAction();
                      onClose();
                    }}
                  >
                    {actionText}
                  </Button>
                </div>
              )}
            </div>

            <IconButton
              icon={<X weight="bold" className="w-3.5 h-3.5" />}
              aria-label="Cerrar notificación"
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="-mr-1.5 -mt-1.5"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
