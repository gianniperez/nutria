import { db } from "@/lib/db";
import { firestore, auth } from "@/lib/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { cleanForFirestore } from "@/utils/firestoreHelpers";
import type { Ingredient } from "@/types/database";

export const foodsApi = {
  /**
   * Obtiene todos los alimentos de Dexie de forma estrictamente de solo lectura.
   */
  async getIngredients(userId = "current_user"): Promise<Ingredient[]> {
    const all = await db.ingredients.toArray();

    // Retornar alimentos del usuario y alimentos base
    const filtered = all.filter(
      (item) => item.userId === userId || item.userId === "current_user" || !item.userId
    );

    // Ordenar: Favoritos arriba, luego por nombre
    return filtered.sort((a, b) => {
      if (a.isFavorite === b.isFavorite) {
        return a.name.localeCompare(b.name);
      }
      return a.isFavorite ? -1 : 1;
    });
  },

  /**
   * Guarda o actualiza un alimento en Dexie y Firestore.
   */
  async saveIngredient(ingredient: Ingredient, isOnline = true): Promise<void> {
    const targetUserId = (ingredient.userId && ingredient.userId !== "current_user")
      ? ingredient.userId
      : auth.currentUser?.uid;

    const itemToSave: Ingredient = {
      ...ingredient,
      userId: targetUserId || ingredient.userId || "current_user",
    };

    // 1. Guardado local inmediato en Dexie
    await db.ingredients.put(itemToSave);

    // 2. Sync asíncrono con Firestore
    if (isOnline && targetUserId && targetUserId !== "current_user") {
      try {
        const itemDoc = doc(firestore, "users", targetUserId, "ingredients", itemToSave.id);
        await setDoc(itemDoc, cleanForFirestore(itemToSave), { merge: true });
      } catch (err) {
        console.warn("No se pudo sincronizar el alimento con Firestore:", err);
      }
    }
  },

  /**
   * Alterna el estado de favorito de un alimento.
   */
  async toggleFavorite(id: string, isFavorite: boolean, userId = "current_user"): Promise<void> {
    const item = await db.ingredients.get(id);
    if (!item) return;

    const updated = {
      ...item,
      isFavorite,
      updatedAt: Date.now(),
    };

    await foodsApi.saveIngredient(updated, userId !== "current_user");
  },

  /**
   * Elimina un alimento de Dexie y Firestore.
   */
  async deleteIngredient(id: string, userId = "current_user"): Promise<void> {
    await db.ingredients.delete(id);

    const targetUserId = (userId && userId !== "current_user") ? userId : auth.currentUser?.uid;

    if (targetUserId && targetUserId !== "current_user") {
      try {
        const itemDoc = doc(firestore, "users", targetUserId, "ingredients", id);
        await deleteDoc(itemDoc);
      } catch (err) {
        console.warn("No se pudo eliminar el alimento de Firestore:", err);
      }
    }
  },
};
