import { db } from "@/lib/db";
import { firestore, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { cleanForFirestore } from "@/utils/firestoreHelpers";
import type { UserProfile } from "@/types/database";

export const profileApi = {
  /**
   * Obtiene el perfil de la base de datos local Dexie priorizando siempre el usuario activo.
   */
  async getLocalProfile(userId?: string | null): Promise<UserProfile | undefined> {
    const activeUid = (userId && userId !== "current_user") ? userId : auth.currentUser?.uid;

    if (activeUid) {
      const userProf = await db.profile.get(activeUid);
      if (userProf) return userProf;
    }

    const guestProf = await db.profile.get("current_user");
    if (guestProf) {
      if (activeUid) {
        // Migrar inmediatamente la clave primaria a la del usuario autenticado
        const migrated: UserProfile = { ...guestProf, userId: activeUid, updatedAt: guestProf.updatedAt || Date.now() };
        await db.profile.put(migrated);
        await db.profile.delete("current_user");
        return migrated;
      }
      return guestProf;
    }

    const all = await db.profile.toArray();
    if (all.length > 0) {
      const best = all.find((p) => p.userId === activeUid) || all[0];
      return best;
    }

    return undefined;
  },

  /**
   * Guarda o actualiza el perfil en Dexie y en Cloud Firestore (si hay sesión).
   */
  async saveProfile(profile: UserProfile, isOnline = true): Promise<void> {
    const targetUserId = (profile.userId && profile.userId !== "current_user")
      ? profile.userId
      : auth.currentUser?.uid;

    const profileToSave: UserProfile = {
      ...profile,
      userId: targetUserId || profile.userId || "current_user",
      updatedAt: Date.now(),
    };

    // 1. Guardar en Dexie y limpiar claves antiguas de invitado si el usuario está autenticado
    await db.profile.put(profileToSave);
    if (targetUserId && targetUserId !== "current_user") {
      await db.profile.delete("current_user");
    }

    // 2. Sincronización asíncrona con Firestore
    if (isOnline && targetUserId && targetUserId !== "current_user") {
      try {
        const userProfileDoc = doc(firestore, "users", targetUserId, "profile", "main");
        await setDoc(userProfileDoc, cleanForFirestore(profileToSave), { merge: true });
      } catch (err) {
        console.warn("No se pudo sincronizar el perfil con Firestore:", err);
      }
    }
  },
};
