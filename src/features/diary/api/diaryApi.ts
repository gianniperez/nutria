import { db } from "@/lib/db";
import { firestore, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { cleanForFirestore } from "@/utils/firestoreHelpers";
import type { DailyLog, FastingSession } from "@/types/database";

export const diaryApi = {
  /**
   * Obtiene el log diario de una fecha (YYYY-MM-DD) desde Dexie.
   */
  async getDailyLog(date: string): Promise<DailyLog | undefined> {
    return await db.dailyLogs.get(date);
  },

  /**
   * Guarda o actualiza el log diario en Dexie y Firestore.
   */
  async saveDailyLog(log: DailyLog, isOnline = true): Promise<void> {
    const targetUserId = (log.userId && log.userId !== "current_user")
      ? log.userId
      : auth.currentUser?.uid;

    const logToSave: DailyLog = {
      ...log,
      userId: targetUserId || log.userId || "current_user",
    };

    await db.dailyLogs.put(logToSave);

    if (isOnline && targetUserId && targetUserId !== "current_user") {
      try {
        const logDoc = doc(firestore, "users", targetUserId, "dailyLogs", logToSave.date);
        await setDoc(logDoc, cleanForFirestore(logToSave), { merge: true });
      } catch (err) {
        console.warn("No se pudo sincronizar el log diario con Firestore:", err);
      }
    }
  },

  /**
   * Obtiene la sesión actual de ayuno.
   */
  async getActiveFastingSession(): Promise<FastingSession | undefined> {
    return await db.fasting.get("current_fasting");
  },

  /**
   * Guarda o actualiza la sesión de ayuno.
   */
  async saveFastingSession(session: FastingSession): Promise<void> {
    await db.fasting.put(session);
  },
};
