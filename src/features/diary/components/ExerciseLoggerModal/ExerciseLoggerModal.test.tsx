import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ExerciseLoggerModal } from "./ExerciseLoggerModal";

vi.mock("@/features/profile", () => ({
  useProfile: () => ({
    profile: { weightKg: 60 },
  }),
}));


describe("ExerciseLoggerModal", () => {
  it("renderiza los 6 presets solicitados y calcula calorías según el peso", () => {
    render(
      <ExerciseLoggerModal
        isOpen={true}
        onClose={vi.fn()}
        onLogExercise={vi.fn()}
        userWeightKg={60}
      />
    );

    expect(screen.getByText("Pesas")).toBeInTheDocument();
    expect(screen.getByText("Cardio / HIIT")).toBeInTheDocument();
    expect(screen.getByText("Caminata 3km/h")).toBeInTheDocument();
    expect(screen.getByText("Running")).toBeInTheDocument();
    expect(screen.getByText("Pilates")).toBeInTheDocument();
    expect(screen.getByText("Baile")).toBeInTheDocument();

    // Comprueba que muestre el peso base
    expect(screen.getAllByText(/60 kg/i).length).toBeGreaterThan(0);
  });

  it("cambia a Baile y calcula correctamente para 60 min y 60 kg (438 kcal)", async () => {
    const handleLog = vi.fn().mockResolvedValue(undefined);
    render(
      <ExerciseLoggerModal
        isOpen={true}
        onClose={vi.fn()}
        onLogExercise={handleLog}
        userWeightKg={60}
      />
    );

    const baileButton = screen.getByRole("button", { name: /baile/i });
    fireEvent.click(baileButton);

    expect(screen.getByText("+438 kcal")).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /registrar \(\+438 kcal\)/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(handleLog).toHaveBeenCalledWith("Baile", 60, 438, 60);
  });
});
