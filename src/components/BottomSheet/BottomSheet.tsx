"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { IconButton } from "../IconButton";
import type { BottomSheetProps } from "./BottomSheet.types";

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Drawer Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className={`relative w-full max-w-lg bg-surface border-t sm:border border-border rounded-t-[1.75rem] sm:rounded-card shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col ${className}`}
          >
            {/* Grab handle for mobile gesture aesthetic */}
            <div className="w-12 h-1.5 bg-border rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60 shrink-0">
                <div className="font-display font-bold text-base sm:text-lg text-text-main">
                  {title}
                </div>
                <IconButton
                  icon={<X weight="bold" className="w-4 h-4" />}
                  aria-label="Cerrar panel"
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                />
              </div>
            )}

            {/* Body scrollable */}
            <div className="p-5 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
