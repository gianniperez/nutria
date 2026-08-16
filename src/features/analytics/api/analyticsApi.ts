import { db } from "@/lib/db";
import { firestore, auth } from "@/lib/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { cleanForFirestore } from "@/utils/firestoreHelpers";
import type { AnthropometricEntry } from "@/types/database";

export const analyticsApi = {
  /**
   * Obtiene todas las mediciones antropométricas ordenadas por fecha.
   */
  async getAnthropometricEntries(userId = "current_user"): Promise<AnthropometricEntry[]> {
    const entries = await db.anthropometry
      .where("userId")
      .equals(userId)
      .toArray();

    return entries.sort((a, b) => a.date.localeCompare(b.date));
  },

  /**
   * Guarda o actualiza una medición en Dexie y Firestore.
   */
  async saveAnthropometricEntry(entry: AnthropometricEntry, isOnline = true): Promise<void> {
    const targetUserId = (entry.userId && entry.userId !== "current_user")
      ? entry.userId
      : auth.currentUser?.uid;

    const itemToSave: AnthropometricEntry = {
      ...entry,
      userId: targetUserId || entry.userId || "current_user",
    };

    await db.anthropometry.put(itemToSave);

    if (isOnline && targetUserId && targetUserId !== "current_user") {
      try {
        const itemDoc = doc(firestore, "users", targetUserId, "anthropometry", itemToSave.id);
        await setDoc(itemDoc, cleanForFirestore(itemToSave), { merge: true });
      } catch (err) {
        console.warn("No se pudo sincronizar la antropometría con Firestore:", err);
      }
    }
  },

  /**
   * Elimina una medición de Dexie y Firestore.
   */
  async deleteAnthropometricEntry(id: string, userId = "current_user"): Promise<void> {
    await db.anthropometry.delete(id);

    const targetUserId = (userId && userId !== "current_user") ? userId : auth.currentUser?.uid;

    if (targetUserId && targetUserId !== "current_user") {
      try {
        const itemDoc = doc(firestore, "users", targetUserId, "anthropometry", id);
        await deleteDoc(itemDoc);
      } catch (err) {
        console.warn("No se pudo eliminar la antropometría de Firestore:", err);
      }
    }
  },
};
