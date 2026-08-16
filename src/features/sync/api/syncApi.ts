import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { firestore, auth } from "@/lib/firebase";
import { db, ensureSeedIngredientsLoaded } from "@/lib/db";
import { cleanForFirestore } from "@/utils/firestoreHelpers";
import type {
  DailyLog,
  Ingredient,
  Recipe,
  AnthropometricEntry,
  UserProfile,
} from "@/types/database";

export const syncApi = {
  /**
   * Sincronización bidireccional inteligente con resolución Last-Write-Wins:
   * Compara los timestamps de cada documento entre Dexie y Firestore y converge al estado más reciente.
   */
  async syncBidirectional(userId: string): Promise<void> {
    const currentUid = auth.currentUser?.uid || userId;
    if (!currentUid || currentUid === "current_user") return;

    // Asegurar que todos los ingredientes curados estén cargados en Dexie
    await ensureSeedIngredientsLoaded(currentUid);

    // 1. Sincronizar Perfil
    try {
      const profDocRef = doc(firestore, "users", currentUid, "profile", "main");
      const remoteProfSnap = await getDoc(profDocRef);
      const remoteProf = remoteProfSnap.exists() ? (remoteProfSnap.data() as UserProfile) : null;

      const localProfiles = await db.profile.toArray();
      const localProf = localProfiles[0] || null;

      if (remoteProf && !localProf) {
        await db.profile.put(remoteProf);
        await db.profile.delete("current_user");
      } else if (localProf && !remoteProf) {
        const toSave: UserProfile = { ...localProf, userId: currentUid, updatedAt: localProf.updatedAt || Date.now() };
        await db.profile.put(toSave);
        await db.profile.delete("current_user");
        await setDoc(profDocRef, cleanForFirestore(toSave), { merge: true });
      } else if (localProf && remoteProf) {
        const localTime = localProf.updatedAt || 0;
        const remoteTime = remoteProf.updatedAt || 0;

        if (remoteTime > localTime) {
          await db.profile.put(remoteProf);
          await db.profile.delete("current_user");
        } else if (localTime > remoteTime) {
          await setDoc(profDocRef, cleanForFirestore(localProf), { merge: true });
        }
      }
    } catch (err) {
      console.warn("Error en sync de perfil:", err);
    }

    // 2. Sincronizar Logs Diarios
    try {
      const logsSnap = await getDocs(collection(firestore, "users", currentUid, "dailyLogs"));
      const remoteLogsMap = new Map<string, DailyLog>();
      logsSnap.forEach((d) => remoteLogsMap.set(d.id, d.data() as DailyLog));

      const localLogs = await db.dailyLogs.toArray();
      const localLogsMap = new Map<string, DailyLog>();
      localLogs.forEach((l) => localLogsMap.set(l.date, l));

      const allDates = new Set([...remoteLogsMap.keys(), ...localLogsMap.keys()]);

      for (const date of allDates) {
        const local = localLogsMap.get(date);
        const remote = remoteLogsMap.get(date);

        if (remote && !local) {
          await db.dailyLogs.put(remote);
        } else if (local && !remote) {
          const updated: DailyLog = { ...local, userId: currentUid, updatedAt: local.updatedAt || Date.now() };
          await db.dailyLogs.put(updated);
          await setDoc(doc(firestore, "users", currentUid, "dailyLogs", date), cleanForFirestore(updated), { merge: true });
        } else if (local && remote) {
          const localTime = local.updatedAt || 0;
          const remoteTime = remote.updatedAt || 0;

          if (remoteTime > localTime) {
            await db.dailyLogs.put(remote);
          } else if (localTime > remoteTime) {
            await setDoc(doc(firestore, "users", currentUid, "dailyLogs", date), cleanForFirestore(local), { merge: true });
          }
        }
      }
    } catch (err) {
      console.warn("Error en sync de dailyLogs:", err);
    }

    // 3. Sincronizar Alimentos
    try {
      const ingSnap = await getDocs(collection(firestore, "users", currentUid, "ingredients"));
      const remoteIngMap = new Map<string, Ingredient>();
      ingSnap.forEach((d) => remoteIngMap.set(d.id, d.data() as Ingredient));

      const localIngredients = await db.ingredients.toArray();
      const localIngMap = new Map<string, Ingredient>();
      localIngredients.forEach((i) => localIngMap.set(i.id, i));

      const allIngIds = new Set([...remoteIngMap.keys(), ...localIngMap.keys()]);

      for (const id of allIngIds) {
        const local = localIngMap.get(id);
        const remote = remoteIngMap.get(id);

        if (remote && !local) {
          await db.ingredients.put(remote);
        } else if (local && !remote) {
          const updated: Ingredient = { ...local, userId: currentUid, updatedAt: local.updatedAt || Date.now() };
          await db.ingredients.put(updated);
          await setDoc(doc(firestore, "users", currentUid, "ingredients", id), cleanForFirestore(updated), { merge: true });
        } else if (local && remote) {
          const localTime = local.updatedAt || 0;
          const remoteTime = remote.updatedAt || 0;

          if (remoteTime > localTime) {
            await db.ingredients.put(remote);
          } else if (localTime > remoteTime) {
            await setDoc(doc(firestore, "users", currentUid, "ingredients", id), cleanForFirestore(local), { merge: true });
          }
        }
      }
    } catch (err) {
      console.warn("Error en sync de alimentos:", err);
    }

    // 4. Sincronizar Recetas
    try {
      const recSnap = await getDocs(collection(firestore, "users", currentUid, "recipes"));
      const remoteRecMap = new Map<string, Recipe>();
      recSnap.forEach((d) => remoteRecMap.set(d.id, d.data() as Recipe));

      const localRecipes = await db.recipes.toArray();
      const localRecMap = new Map<string, Recipe>();
      localRecipes.forEach((r) => localRecMap.set(r.id, r));

      const allRecIds = new Set([...remoteRecMap.keys(), ...localRecMap.keys()]);

      for (const id of allRecIds) {
        const local = localRecMap.get(id);
        const remote = remoteRecMap.get(id);

        if (remote && !local) {
          await db.recipes.put(remote);
        } else if (local && !remote) {
          const updated: Recipe = { ...local, userId: currentUid, updatedAt: local.updatedAt || Date.now() };
          await db.recipes.put(updated);
          await setDoc(doc(firestore, "users", currentUid, "recipes", id), cleanForFirestore(updated), { merge: true });
        } else if (local && remote) {
          const localTime = local.updatedAt || 0;
          const remoteTime = remote.updatedAt || 0;

          if (remoteTime > localTime) {
            await db.recipes.put(remote);
          } else if (localTime > remoteTime) {
            await setDoc(doc(firestore, "users", currentUid, "recipes", id), cleanForFirestore(local), { merge: true });
          }
        }
      }
    } catch (err) {
      console.warn("Error en sync de recetas:", err);
    }

    // 5. Sincronizar Antropometría
    try {
      const anthroSnap = await getDocs(collection(firestore, "users", currentUid, "anthropometry"));
      const remoteAnthroMap = new Map<string, AnthropometricEntry>();
      anthroSnap.forEach((d) => remoteAnthroMap.set(d.id, d.data() as AnthropometricEntry));

      const localAnthro = await db.anthropometry.toArray();
      const localAnthroMap = new Map<string, AnthropometricEntry>();
      localAnthro.forEach((a) => localAnthroMap.set(a.id, a));

      const allAnthroIds = new Set([...remoteAnthroMap.keys(), ...localAnthroMap.keys()]);

      for (const id of allAnthroIds) {
        const local = localAnthroMap.get(id);
        const remote = remoteAnthroMap.get(id);

        if (remote && !local) {
          await db.anthropometry.put(remote);
        } else if (local && !remote) {
          const updated: AnthropometricEntry = { ...local, userId: currentUid };
          await db.anthropometry.put(updated);
          await setDoc(doc(firestore, "users", currentUid, "anthropometry", id), cleanForFirestore(updated), { merge: true });
        }
      }
    } catch (err) {
      console.warn("Error en sync de antropometría:", err);
    }
  },

  /**
   * Suscribe listeners en tiempo real para sincronizar cambios remotos instantáneamente hacia Dexie.
   */
  subscribeToRemoteChanges(userId: string): Unsubscribe {
    const currentUid = auth.currentUser?.uid || userId;
    if (!currentUid || currentUid === "current_user") {
      return () => {};
    }

    const unsubs: Unsubscribe[] = [];

    try {
      // Listener de Logs Diarios
      const logsCol = collection(firestore, "users", currentUid, "dailyLogs");
      const unLog = onSnapshot(
        logsCol,
        (snap) => {
          snap.docChanges().forEach(async (change) => {
            if (change.type === "added" || change.type === "modified") {
              const data = change.doc.data() as DailyLog;
              const local = await db.dailyLogs.get(data.date);
              if (!local || (data.updatedAt || 0) > (local.updatedAt || 0)) {
                await db.dailyLogs.put(data);
              }
            } else if (change.type === "removed") {
              await db.dailyLogs.delete(change.doc.id);
            }
          });
        },
        (err) => {
          console.warn("Aviso de sincronización de logs diarios:", err.message);
        }
      );
      unsubs.push(unLog);

      // Listener de Recetas
      const recCol = collection(firestore, "users", currentUid, "recipes");
      const unRec = onSnapshot(
        recCol,
        (snap) => {
          snap.docChanges().forEach(async (change) => {
            if (change.type === "added" || change.type === "modified") {
              const data = change.doc.data() as Recipe;
              const local = await db.recipes.get(data.id);
              if (!local || (data.updatedAt || 0) > (local.updatedAt || 0)) {
                await db.recipes.put(data);
              }
            } else if (change.type === "removed") {
              await db.recipes.delete(change.doc.id);
            }
          });
        },
        (err) => {
          console.warn("Aviso de sincronización de recetas:", err.message);
        }
      );
      unsubs.push(unRec);

      // Listener de Perfil
      const profRef = doc(firestore, "users", currentUid, "profile", "main");
      const unProf = onSnapshot(
        profRef,
        async (snap) => {
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            const localProfiles = await db.profile.toArray();
            const local = localProfiles[0];
            if (!local || (data.updatedAt || 0) > (local.updatedAt || 0)) {
              await db.profile.put(data);
              await db.profile.delete("current_user");
            }
          }
        },
        (err) => {
          console.warn("Aviso de sincronización de perfil:", err.message);
        }
      );
      unsubs.push(unProf);
    } catch (err) {
      console.warn("Error suscribiendo listeners de Firestore:", err);
    }

    return () => {
      unsubs.forEach((un) => un());
    };
  },
};
