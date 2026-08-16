import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BottomSheet } from "./BottomSheet";

describe("BottomSheet", () => {
  it("renderiza el contenido cuando está visible", () => {
    render(
      <BottomSheet isOpen={true} onClose={() => {}} title="Opciones">
        <p>Contenido del drawer</p>
      </BottomSheet>
    );

    expect(screen.getByText("Opciones")).toBeDefined();
    expect(screen.getByText("Contenido del drawer")).toBeDefined();
  });
});
