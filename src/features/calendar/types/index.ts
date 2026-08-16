import type { DailyLog } from "@/types/database";
import type { CyclePhaseInfo } from "@/utils/menstrualCycleCalculations";

export interface CalendarDayCell {
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dailyLog?: DailyLog;
  cycleInfo: CyclePhaseInfo;
  totalCalories: number;
  isCalorieGoalMet: boolean; // within +/- 10%
  hasActivity: boolean;
}
