import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToastNotification } from "./ToastNotification";

describe("ToastNotification", () => {
  it("renderiza el título de la notificación", () => {
    render(
      <ToastNotification
        isOpen={true}
        onClose={() => {}}
        title="Fase Lútea Detectada"
        message="Tu cuerpo quema más energía hoy."
        variant="menstrual"
      />
    );

    expect(screen.getByText("Fase Lútea Detectada")).toBeDefined();
    expect(screen.getByText("Tu cuerpo quema más energía hoy.")).toBeDefined();
  });
});
