import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renderiza el título y contenido cuando está abierto", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Editar Alimento">
        <p>Formulario de edición</p>
      </Modal>
    );

    expect(screen.getByText("Editar Alimento")).toBeDefined();
    expect(screen.getByText("Formulario de edición")).toBeDefined();

    const closeBtn = screen.getByLabelText("Cerrar modal");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
