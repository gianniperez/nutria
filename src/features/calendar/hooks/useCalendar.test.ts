import { describe, it, expect } from "vitest";
import { getCyclePhaseInfo } from "@/utils/menstrualCycleCalculations";

describe("Calendar & Analytics feature logic", () => {
  it("determina correctamente las fases del ciclo para las celdas del calendario", () => {
    const info = getCyclePhaseInfo("2026-08-01", "2026-08-01", 28, 5);
    expect(info.phase).toBe("menstrual");
    expect(info.cycleDay).toBe(1);

    const lutealInfo = getCyclePhaseInfo("2026-08-20", "2026-08-01", 28, 5);
    expect(lutealInfo.phase).toBe("luteal");
    expect(lutealInfo.isLutealAlertActive).toBe(true);
  });
});
