import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavigationShell } from "./NavigationShell";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/diario",
}));

describe("NavigationShell", () => {
  it("renderiza correctamente los links de navegación principales", () => {
    render(
      <NavigationShell>
        <div>Contenido de Prueba</div>
      </NavigationShell>
    );

    expect(screen.getByText("Contenido de Prueba")).toBeInTheDocument();
    expect(screen.getAllByText("Diario").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Recetas").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Alimentos").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Calendario").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Métricas").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Perfil").length).toBeGreaterThan(0);
  });
});
