import { differenceInCalendarDays, addDays, parseISO, format } from "date-fns";

export type MenstrualPhaseType = "menstrual" | "follicular" | "ovulatory" | "luteal";

export interface CyclePhaseInfo {
  phase: MenstrualPhaseType;
  phaseName: string;
  cycleDay: number;
  totalCycleDays: number;
  phaseDescription: string;
  isLutealAlertActive: boolean;
  suggestedCalorieAdjustmentKcal: number;
  colorClass: string;
  bgClass: string;
  nextPeriodDate: string; // YYYY-MM-DD
}

/**
 * Determina con precisión la fase hormonal del ciclo menstrual y sus recomendaciones fisiológicas.
 *
 * @param targetDateStr - Fecha objetivo a evaluar (YYYY-MM-DD).
 * @param lastPeriodStartDateStr - Fecha del último primer día de sangrado (YYYY-MM-DD).
 * @param cycleLengthDays - Duración promedio del ciclo (20 a 45 días, default: 28).
 * @param periodDurationDays - Duración del sangrado (2 a 10 días, default: 5).
 */
export function getCyclePhaseInfo(
  targetDateStr: string,
  lastPeriodStartDateStr: string,
  cycleLengthDays = 28,
  periodDurationDays = 5
): CyclePhaseInfo {
  const targetDate = parseISO(targetDateStr);
  const lastPeriodStart = parseISO(lastPeriodStartDateStr);

  const safeCycleLength = Math.max(20, Math.min(45, cycleLengthDays || 28));
  const safePeriodDuration = Math.max(2, Math.min(10, periodDurationDays || 5));

  const diffDays = differenceInCalendarDays(targetDate, lastPeriodStart);

  // Normalizar día del ciclo (1 a safeCycleLength) usando aritmética modular positiva
  const cycleDay = (((diffDays % safeCycleLength) + safeCycleLength) % safeCycleLength) + 1;

  const ovulationDay = safeCycleLength - 14;

  let phase: MenstrualPhaseType = "follicular";
  let phaseName = "Fase Folicular";
  let phaseDescription = "Energía y fuerza en aumento. Excelente sensibilidad a los carbohidratos.";
  let isLutealAlertActive = false;
  let suggestedCalorieAdjustmentKcal = 0;
  let colorClass = "text-secondary-dark";
  let bgClass = "bg-secondary-light/40 border-secondary/40";

  if (cycleDay <= safePeriodDuration) {
    phase = "menstrual";
    phaseName = "Fase Menstrual";
    phaseDescription = "Prioriza el descanso, alimentos ricos en hierro y entrenamiento suave o regenerativo.";
    colorClass = "text-menstrual-dark";
    bgClass = "bg-menstrual-light/40 border-menstrual/40";
  } else if (cycleDay <= ovulationDay - 2) {
    phase = "follicular";
    phaseName = "Fase Folicular";
    phaseDescription = "Suben los estrógenos. Momento óptimo para progresiones de fuerza e hipertrofia.";
    colorClass = "text-follicular-dark";
    bgClass = "bg-follicular-light/40 border-follicular/40";
  } else if (cycleDay <= ovulationDay + 1) {
    phase = "ovulatory";
    phaseName = "Fase Ovulatoria";
    phaseDescription = "Pico máximo de energía y motivación. Gran resistencia al esfuerzo.";
    colorClass = "text-ovulation-dark";
    bgClass = "bg-ovulation-light/40 border-ovulation/40";
  } else {
    phase = "luteal";
    phaseName = "Fase Lútea";
    phaseDescription = "La progesterona eleva tu TMB (~150-200 kcal/día). Prioriza grasas saludables y autocuidado.";
    isLutealAlertActive = true;
    suggestedCalorieAdjustmentKcal = 150;
    colorClass = "text-luteal-dark";
    bgClass = "bg-luteal-light/40 border-luteal/40";
  }

  // Próximo período proyectado
  const cycleCyclesPassed = Math.floor(diffDays / safeCycleLength);
  const nextPeriodDateObj = addDays(lastPeriodStart, (cycleCyclesPassed + 1) * safeCycleLength);
  const nextPeriodDate = format(nextPeriodDateObj, "yyyy-MM-dd");

  return {
    phase,
    phaseName,
    cycleDay,
    totalCycleDays: safeCycleLength,
    phaseDescription,
    isLutealAlertActive,
    suggestedCalorieAdjustmentKcal,
    colorClass,
    bgClass,
    nextPeriodDate,
  };
}
