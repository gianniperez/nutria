import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmModal } from "./ConfirmModal";

describe("ConfirmModal", () => {
  it("dispara onConfirm al hacer click en el botón de confirmar", () => {
    const handleConfirm = vi.fn();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={handleConfirm}
        title="¿Eliminar receta?"
        description="Esta acción no se puede deshacer."
        confirmText="Eliminar"
      />
    );

    expect(screen.getByText("¿Eliminar receta?")).toBeDefined();
    
    const confirmBtn = screen.getByText("Eliminar");
    fireEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalled();
  });
});
