import { db } from "@/lib/db";
import { firestore, auth } from "@/lib/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { cleanForFirestore } from "@/utils/firestoreHelpers";
import type { Recipe } from "@/types/database";

export const recipesApi = {
  /**
   * Obtiene todas las recetas de Dexie ordenadas por nombre.
   */
  async getRecipes(userId = "current_user"): Promise<Recipe[]> {
    const all = await db.recipes.toArray();

    const filtered = all.filter(
      (r) => r.userId === userId || r.userId === "current_user" || !r.userId
    );

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  },

  /**
   * Guarda o actualiza una receta en Dexie y Firestore.
   */
  async saveRecipe(recipe: Recipe, isOnline = true): Promise<void> {
    const targetUserId = (recipe.userId && recipe.userId !== "current_user")
      ? recipe.userId
      : auth.currentUser?.uid;

    const recipeToSave: Recipe = {
      ...recipe,
      userId: targetUserId || recipe.userId || "current_user",
    };

    // 1. Guardado local en Dexie
    await db.recipes.put(recipeToSave);

    // 2. Sync asíncrono con Firestore
    if (isOnline && targetUserId && targetUserId !== "current_user") {
      try {
        const itemDoc = doc(firestore, "users", targetUserId, "recipes", recipeToSave.id);
        await setDoc(itemDoc, cleanForFirestore(recipeToSave), { merge: true });
      } catch (err) {
        console.warn("No se pudo sincronizar la receta con Firestore:", err);
      }
    }
  },

  /**
   * Elimina una receta de Dexie y Firestore.
   */
  async deleteRecipe(id: string, userId = "current_user"): Promise<void> {
    await db.recipes.delete(id);

    const targetUserId = (userId && userId !== "current_user") ? userId : auth.currentUser?.uid;

    if (targetUserId && targetUserId !== "current_user") {
      try {
        const itemDoc = doc(firestore, "users", targetUserId, "recipes", id);
        await deleteDoc(itemDoc);
      } catch (err) {
        console.warn("No se pudo eliminar la receta de Firestore:", err);
      }
    }
  },
};
