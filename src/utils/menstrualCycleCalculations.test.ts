import { describe, it, expect } from "vitest";
import { getCyclePhaseInfo } from "./menstrualCycleCalculations";

describe("menstrualCycleCalculations", () => {
  const lastPeriodStart = "2026-08-11"; // Día 1

  it("identifica el día 11 de agosto como inicio de Fase Menstrual (Día 1)", () => {
    const info = getCyclePhaseInfo("2026-08-11", lastPeriodStart, 28, 5);
    expect(info.cycleDay).toBe(1);
    expect(info.phase).toBe("menstrual");
  });

  it("identifica el día 15 de agosto como último día de sangrado (Día 5)", () => {
    const info = getCyclePhaseInfo("2026-08-15", lastPeriodStart, 28, 5);
    expect(info.cycleDay).toBe(5);
    expect(info.phase).toBe("menstrual");
  });

  it("identifica el día 16 de agosto como Fase Folicular (Día 6)", () => {
    const info = getCyclePhaseInfo("2026-08-16", lastPeriodStart, 28, 5);
    expect(info.cycleDay).toBe(6);
    expect(info.phase).toBe("follicular");
  });

  it("identifica el día 10 de agosto (día previo al inicio) como Fase Lútea del ciclo anterior (Día 28)", () => {
    const info = getCyclePhaseInfo("2026-08-10", lastPeriodStart, 28, 5);
    expect(info.cycleDay).toBe(28);
    expect(info.phase).toBe("luteal");
  });

  it("identifica el día 7 de agosto como Fase Lútea del ciclo anterior (Día 25)", () => {
    const info = getCyclePhaseInfo("2026-08-07", lastPeriodStart, 28, 5);
    expect(info.cycleDay).toBe(25);
    expect(info.phase).toBe("luteal");
  });

  it("calcula la predicción del próximo período (28 días después: 2026-09-08)", () => {
    const info = getCyclePhaseInfo("2026-08-15", lastPeriodStart, 28, 5);
    expect(info.nextPeriodDate).toBe("2026-09-08");
  });
});
