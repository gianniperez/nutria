"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";
import type { SearchInputProps } from "./SearchInput.types";

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar alimento o receta...",
  disabled = false,
  className = "",
  onClear,
  autoFocus = false,
}: SearchInputProps) {
  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <MagnifyingGlass
        weight="bold"
        className="absolute left-3.5 w-4 h-4 text-text-muted pointer-events-none"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className="w-full bg-surface text-text-main text-sm rounded-button border border-border pl-10 pr-9 py-2.5 shadow-xs transition-all placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-50"
      />

      {value && (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={handleClear}
          className="absolute right-3 p-1 text-text-muted hover:text-text-main rounded-full hover:bg-surface-hover transition-colors cursor-pointer"
        >
          <X weight="bold" className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
