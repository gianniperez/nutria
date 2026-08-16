import { db } from "@/lib/db";
import type { DailyLog } from "@/types/database";

export const calendarApi = {
  /**
   * Obtiene todos los logs diarios en un rango de fechas (YYYY-MM-DD).
   */
  async getDailyLogsInRange(startDate: string, endDate: string): Promise<DailyLog[]> {
    return await db.dailyLogs
      .where("date")
      .between(startDate, endDate, true, true)
      .toArray();
  },
};
