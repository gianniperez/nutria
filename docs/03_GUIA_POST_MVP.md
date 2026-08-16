# 🚀 Guía de Implementación Post-MVP — Nutria

Este documento define el roadmap técnico, las integraciones avanzadas de Inteligencia Artificial Multimodal, la gamificación, el Onboarding ilustrado, la seguridad biométrica y las mejoras visuales para las etapas posteriores al lanzamiento del MVP de **Nutria**.

---

## Índice

1. [Onboarding Wizard Guiado por la Nutria](#1-onboarding-wizard-guiado-por-la-nutria)
2. [Gamificación y Microinteracciones Sensoriales](#2-gamificación-y-microinteracciones-sensoriales)
3. [Botón Personalizado de Instalación PWA](#3-botón-personalizado-de-instalación-pwa)
4. [Integración de Inteligencia Artificial Multimodal (Gemini Flash Vision)](#4-integración-de-inteligencia-artificial-multimodal-gemini-flash-vision)
5. [Capa de Privacidad y Bloqueo Biométrico](#5-capa-de-privacidad-y-bloqueo-biométrico)
6. [Texturas, Patrones Ilustrados & Estética Creative Dev](#6-texturas-patrones-ilustrados--estética-creative-dev)
7. [Exportación de Informes Clínicos en PDF](#7-exportación-de-informes-clínicos-en-pdf)
8. [Catálogo de Componentes Post-MVP](#8-catálogo-de-componentes-post-mvp)

---

## 1. Onboarding Wizard Guiado por la Nutria

Flujo interactivo paso a paso que se presenta la primera vez que un usuario abre la app:

- **Paso 1: Bienvenida & Datos Biométricos:** La mascota Nutria saluda y solicita peso, altura y edad.
- **Paso 2: Meta Calórica & Ciclo Menstrual:** Selección del objetivo (perder peso rápido/moderado o mantenimiento) y configuración de duración de ciclo y período.
- **Paso 3: Selector de Tema & Celebración:** Selección de una de las 3 paletas (`Matcha & Peach`, `Cyber Lilac`, `Warm Otter`) con animación de bienvenida.

---

## 2. Gamificación y Microinteracciones Sensoriales

### 2.1. Vibración Háptica Móvil (PWA Haptics)

- Utiliza la Web Haptics API (`navigator.vibrate(10)`) para generar pulsos táctiles suaves al:
  - Tildar una comida completada.
  - Alternar un ingrediente favorito (⭐).
  - Presionar botones de acción rápida.

### 2.2. Celebraciones con Confeti Dinámico (`canvas-confetti`)

- Explosión de confeti con los colores del tema activo al:
  - Completar la meta calórica del día sin exceder el presupuesto.
  - Registrar una racha de 7, 14 o 30 días consecutivos.
  - Puntuar el día con ánimo 5/5 ⭐.

---

## 3. Botón Personalizado de Instalación PWA

Para resolver la inconsistencia del banner nativo del navegador:

- Componente `InstallAppBanner` en la pantalla de Perfil.
- En Android/Chrome: Captura el evento `beforeinstallprompt` y lanza el diálogo de instalación con un solo toque.
- En iOS/Safari: Detecta el dispositivo y despliega un drawer ilustrado explicando cómo tocar *"Compartir $\rightarrow$ Agregar a Pantalla de Inicio"*.

---

## 4. Integración de Inteligencia Artificial Multimodal (Gemini Flash Vision)

### 4.1. Escáner de Etiquetas Nutricionales (OCR Inteligente)

- En el modal de creación de ingredientes, el usuario presiona el botón 📸 *"Escanear Etiqueta"*.
- Captura la tabla nutricional y la envía a `/api/ai/scan-nutrition-label` (Gemini 2.0 Flash) para extraer automáticamente porción, calorías, proteínas, carbohidratos, grasas y fibra en formato JSON.

### 4.2. Asistente de Plato por Foto o Voz ("Nutria Vision")

- El usuario saca foto a su comida o graba un audio (*"Almorcé 1 taza de arroz integral con 150g de pechuga de pollo y ensalada verde"*).
- La IA desglosa los componentes individuales y estima los gramajes.

---

## 5. Capa de Privacidad y Bloqueo Biométrico

- **PIN de 4 Dígitos:** Configurable en ajustes para solicitar código al abrir la app o acceder al Calendario.
- **Soporte WebAuthn (Face ID / Touch ID / Windows Hello):** Desbloqueo biométrico nativo.
- **Privacy Blur:** Gesto de triple toque o botón en el header que desenfoca instantáneamente los registros de amor y ciclo menstrual.

---

## 6. Texturas, Patrones Ilustrados & Estética Creative Dev

- **Patrón "Otter River & Cozy Paws":** Siluetas SVG en lineart fino de patitas de nutria, hojas de té matcha y ondas de agua (3% a 6% de opacidad).
- **Patrón "Botanical Herbal & Berries":** Ramitas de lavanda y bayas en estilo botanical lineart.
- **Filtro de Ruido (Grain Texture):** Filtro SVG `feTurbulence` sutil para un acabado analógico satinado.

---

## 7. Exportación de Informes Clínicos en PDF

- Generador de reportes PDF descargables para consultas médicas o nutricionales:
  - Resumen mensual de calorías y macros.
  - Correlación de variaciones de peso a lo largo de las 4 fases del ciclo menstrual.
  - Historial de medidas corporales y notas físicas.

---

## 8. Catálogo de Componentes Post-MVP

1. **`OnboardingWizard`**: Modal interactivo de 3 pasos para nuevos usuarios.
2. **`InstallAppBanner`**: Componente de instalación asistida de PWA.
3. **`NutritionLabelScannerModal`**: Modal con visor de cámara y Gemini Flash.
4. **`VoiceLogButton`**: Botón con animación de ondas de audio para dictado de comidas.
5. **`PinLockScreen`**: Teclado numérico táctil animado para desbloqueo por PIN.
6. **`ReportPreviewModal`**: Visor para previsualizar y descargar el PDF clínico.
7. **`BackgroundPatternLayer`**: Capa vectorial SVG fija con switcher de texturas.
