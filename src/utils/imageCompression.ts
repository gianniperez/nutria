/**
 * Comprime una imagen en el cliente redimensionándola a un tamaño máximo
 * y convirtiéndola a formato WebP optimizado en Base64 (~30 KB).
 *
 * @param file - Archivo de imagen original seleccionado por el usuario.
 * @param maxDimension - Dimensión máxima en píxeles (ancho o alto, default: 400).
 * @param quality - Calidad de compresión WebP entre 0 y 1 (default: 0.82).
 * @returns Promise con la imagen comprimida en formato Data URL Base64.
 */
export async function compressImageToWebP(
  file: File,
  maxDimension = 400,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Si no estamos en un entorno con DOM (SSR / pruebas sin canvas), rechazar o retornar vacío
    if (typeof window === "undefined" || typeof FileReader === "undefined") {
      return reject(new Error("La compresión de imágenes solo está disponible en el navegador."));
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calcular nuevo tamaño manteniendo el ratio de aspecto
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("No se pudo obtener el contexto 2D del Canvas."));
        }

        // Dibujar imagen escalada
        ctx.drawImage(img, 0, 0, width, height);

        // Exportar a WebP (con fallback a JPEG si el navegador no soporta WebP)
        try {
          const webpDataUrl = canvas.toDataURL("image/webp", quality);
          resolve(webpDataUrl);
        } catch {
          const fallbackDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(fallbackDataUrl);
        }
      };

      img.onerror = () => {
        reject(new Error("Error al cargar la imagen en memoria para compresión."));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo de imagen."));
    };

    reader.readAsDataURL(file);
  });
}
