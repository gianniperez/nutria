/**
 * Limpia un objeto eliminando cualquier clave con valor 'undefined' para compatibilidad estricta con Firestore.
 */
export function cleanForFirestore<T>(data: T): Record<string, unknown> {
  if (!data || typeof data !== "object") return {};
  return JSON.parse(JSON.stringify(data));
}
