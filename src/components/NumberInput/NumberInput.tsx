"use client";

import { useState, useCallback } from "react";
import { Minus, Plus } from "@phosphor-icons/react";
import { IconButton } from "../IconButton";
import type { NumberInputProps } from "./NumberInput.types";

export function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 10000,
  step = 1,
  unit = "",
  disabled = false,
  className = "",
}: NumberInputProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [displayValue, setDisplayValue] = useState<string>(
    isNaN(value) ? "" : String(value).replace(".", ",")
  );

  // Sincronizar texto cuando el valor numérico externo cambia durante el render
  if (value !== prevValue) {
    setPrevValue(value);
    setDisplayValue(isNaN(value) ? "" : String(value).replace(".", ","));
  }

  const handleDecrement = useCallback(() => {
    if (value - step >= min) {
      const nextVal = Number((value - step).toFixed(2));
      onChange(nextVal);
    }
  }, [value, step, min, onChange]);

  const handleIncrement = useCallback(() => {
    if (value + step <= max) {
      const nextVal = Number((value + step).toFixed(2));
      onChange(nextVal);
    }
  }, [value, step, max, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);

    // Si termina en coma o punto mientras escribe (ej. "157,"), no interrumpir al usuario
    if (raw === "" || raw === "-" || raw.endsWith(",") || raw.endsWith(".")) {
      return;
    }

    const normalized = raw.replace(",", ".");
    const parsed = parseFloat(normalized);

    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(Number(clamped.toFixed(2)));
    }
  };

  const handleBlur = () => {
    if (displayValue === "" || displayValue === "-") {
      onChange(min);
      setDisplayValue(String(min).replace(".", ","));
      return;
    }

    const normalized = displayValue.replace(",", ".");
    const parsed = parseFloat(normalized);

    if (isNaN(parsed)) {
      onChange(min);
      setDisplayValue(String(min).replace(".", ","));
    } else {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(Number(clamped.toFixed(2)));
      setDisplayValue(String(Number(clamped.toFixed(2))).replace(".", ","));
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full min-w-0 ${className}`}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted truncate">
          {label}
        </label>
      )}

      <div className="flex items-center justify-between gap-1 bg-surface border border-border rounded-button p-1 shadow-xs w-full min-w-0">
        <IconButton
          icon={<Minus weight="bold" className="w-3.5 h-3.5" />}
          aria-label="Disminuir"
          size="sm"
          variant="outline"
          shape="circle"
          disabled={disabled || value <= min}
          onClick={handleDecrement}
          className="shrink-0"
        />

        <div className="flex-1 min-w-0 flex items-center justify-center gap-1 px-1">
          <input
            type="text"
            inputMode="decimal"
            disabled={disabled}
            value={displayValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-full min-w-0 text-center font-semibold text-text-main text-sm bg-transparent focus:outline-none"
          />
          {unit && (
            <span className="text-xs text-text-muted font-medium select-none shrink-0">
              {unit}
            </span>
          )}
        </div>

        <IconButton
          icon={<Plus weight="bold" className="w-3.5 h-3.5" />}
          aria-label="Aumentar"
          size="sm"
          variant="primary"
          shape="circle"
          disabled={disabled || value >= max}
          onClick={handleIncrement}
          className="shrink-0"
        />
      </div>
    </div>
  );
}
