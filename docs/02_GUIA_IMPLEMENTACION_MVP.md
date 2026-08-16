# 🛠️ Guía de Implementación del MVP — Nutria

Esta guía define el plan de construcción paso a paso para el MVP de **Nutria**, respetando la arquitectura **Feature-Sliced Design (FSD)**, el uso estricto de **Plop generators**, los tokens semánticos en `globals.css` (con variantes `-light` y `-dark`), el catálogo exhaustivo de **componentes reutilizables** y la **sincronización multi-dispositivo en tiempo real (Celular $\leftrightarrow$ PC) con Firebase y caché local Dexie.js**.

---

## 🧭 Regla de Oro: "Zero-Code Pages"

Las páginas en Next.js (`src/app/**/page.tsx`) deben actuar únicamente como coordinadores de vista de alto nivel.

- **No deben tener lógica de negocio pesada, ni estilos repetidos, ni elementos HTML directos complejos.**
- Toda la UI se ensambla a partir de componentes de `src/components/` o de las features en `src/features/[feature]/components/`.

---

## Índice de Fases

- [Fase 0: Setup de Diseño, Fuentes, Tokens y Dependencias](#fase-0-setup-de-diseño-fuentes-tokens-y-dependencias)
- [Fase 1: Capa de Datos Firebase + Cache Local Dexie.js & Auth con Google](#fase-1-capa-de-datos-firebase--cache-local-dexiejs--auth-con-google)
- [Fase 2: Catálogo de Componentes Transversales Reutilizables (Plop)](#fase-2-catálogo-de-componentes-transversales-reutilizables-plop)
- [Fase 3: Feature Profile & Onboarding Biométrico](#fase-3-feature-profile--onboarding-biométrico)
- [Fase 4: Feature Inventory (Ingredientes & Recetario)](#fase-4-feature-inventory-ingredientes--recetario)
- [Fase 5: Feature Diary (Registro Diario & Baja Fricción)](#fase-5-feature-diary-registro-diario--baja-fricción)
- [Fase 6: Feature Calendar (Ciclo Menstrual & 4 Fases Hormonales)](#fase-6-feature-calendar-ciclo-menstrual--4-fases-hormonales)
- [Fase 7: Feature Analytics (Correlaciones, Medidas & Racha)](#fase-7-feature-analytics-correlaciones-medidas--racha)
- [Fase 8: Layout Shell Responsive, PWA Offline & Verificación](#fase-8-layout-shell-responsive-pwa-offline--verificación)

---

## Fase 0: Setup de Diseño, Fuentes, Tokens y Dependencias

### 0.1. Tipografías en `src/app/layout.tsx`

- Configurar Google Fonts con Next.js Font Optimization:
  - `Fraunces` (variable: `--font-display`, pesos 400, 600, 700, 900).
  - `Poppins` (variable: `--font-sans`, pesos 300, 400, 500, 600, 700).

### 0.2. Variables CSS y Tokens Semánticos en `src/styles/globals.css`

- Declarar las 3 paletas completas con sus variantes **`-light`** y **`-dark`**:
  - `matcha-peach` (Default).
  - `cyber-lilac`.
  - `warm-otter`.
- Mapear variables semánticas en `@theme` para Tailwind CSS v4.

### 0.3. Instalación de Dependencias

```bash
npm install firebase dexie dexie-react-hooks framer-motion @phosphor-icons/react canvas-confetti date-fns
npm install -D @types/canvas-confetti
```

---

## Fase 1: Capa de Datos Firebase + Cache Local Dexie.js & Auth con Google

### 1.1. Configuración de Firebase (`src/lib/firebase.ts`)

- Inicializar Firebase App con variables de entorno (`.env.local`):
  - `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, etc.
- Exportar instancias de `auth` (con `GoogleAuthProvider`) y `db` (`getFirestore`).

### 1.2. Base de Datos Cache Local (`src/lib/db.ts`)

- Configurar `Dexie` con las tablas:
  - `profile`, `ingredients`, `recipes`, `dailyLogs`, `anthropometry`, `fasting`.
- **Sync Engine:** Hook o servicio que sincroniza escrituras locales a Firestore en `users/{userId}/...` y escucha cambios remotos con `onSnapshot`.

### 1.3. Utilidad de Compresión de Imágenes WebP (`src/utils/imageCompression.ts`)

- Función cliente que recibe un `File` de imagen, lo dibuja en un Canvas redimensionado a máx $400\times400\text{ px}$ y lo exporta como Base64 WebP optimizado (~30 KB).

### 1.4. Contexto y Hooks de Autenticación (`src/providers/AuthProvider.tsx`)

- `useAuth()`: Provee `user`, `loading`, `signInWithGoogle()`, `signOut()`.

---

## Fase 2: Catálogo de Componentes Transversales Reutilizables (Plop)

> [!IMPORTANT]
> **Generación Estricta:** Ejecutar `npm run generate` -> `component` para cada componente transversal.

### 2.1. Layout & Navegación (`src/components/layout/`)

- `AppLayout`: Shell responsive que alterna entre desktop sidebar y mobile bottom bar.
- `Header`: Encabezado unificado con botón de Google Login/Avatar, selector de temas y avatar de Nutria.
- `BottomNavBar`: Barra de navegación inferior móvil para PWA con animación de pestaña activa.
- `DesktopSidebar`: Menú lateral para iPad / Desktop.
- `PageContainer`: Contenedor centralizado con padding y scroll óptimo.
- `SyncStatusBadge`: Indicador visual de estado de sincronización con Firestore (🟢 Sincronizado, 🟡 Local, 🔄 Sincronizando).

### 2.2. UI Atómica & Formularios (`src/components/ui/`)

- `Button`: Variantes semánticas (`primary`, `secondary`, `accent`, `outline`, `ghost`, `danger`, `menstrual`, `love`) con microanimación `whileTap`.
- `IconButton`: Botón circular/cuadrado con icono y tooltip (favorito, borrar, editar, cerrar).
- `Input`: Input accesible con soporte para icono y validación.
- `NumberInput`: Input para pesos y calorías con botones de ajuste `+` / `-`.
- `SearchInput`: Campo de búsqueda con debounce y botón de limpieza.
- `SegmentedControl`: Selector tipo pestañas redondeadas (*pills*).
- `ToggleSwitch`: Interruptor animado para opciones booleanas.
- `Badge`: Etiqueta para macros, tags y fases menstruales.
- `Card`: Contenedor base polimórfico (`elevated`, `flat`, `interactive`).
- `Modal` & `BottomSheet`: Diálogos y drawers animados con backdrop blur.
- `ConfirmModal`: Modal de confirmación destructiva ilustrado con la Nutria.
- `EmptyState`: Vista para listas vacías con ilustración de Nutria y botón de acción.
- `SkeletonLoader`: Shimmer animado para tarjetas y listas en carga.
- `ToastNotification`: Notificación flotante para confirmaciones y alertas contextuales.

### 2.3. Visualización de Datos & Progreso (`src/components/charts/` & `src/components/progress/`)

- `MacroProgressBar`: Barra segmentada con Carbos, Proteínas y Grasas.
- `MacroNutrientPill`: Cápsula individual de macro (gramos y color asignado).
- `CircularProgress`: Anillo SVG interactivo para calorías restantes y ayuno.
- `StatCard`: Tarjeta de métrica (valor, unidad, icono, comparativa).
- `TrendLineChart`: Gráfico de línea SVG con sombreado de fases del ciclo.
- `CorrelationChart`: Gráfico de correlación Ánimo vs Déficit.
- `StreakHeatmap`: Calendario de consistencia mensual estilo contribution graph.
- `DateNavigator`: Navegador de fechas interactivo `[<] [Hoy] [>]`.

### 2.4. Entidades y Componentes de Dominio (`src/components/domain/`)

- `NutriaMascot`: SVG reactivo con estados de ánimo (1-5), fase menstrual y racha cumplida.
- `IngredientImage`: Thumbnail de comida con fallback vectorial si no hay foto.
- `IngredientRow`: Fila reutilizable de ingrediente (foto, nombre, macros, favorito, acciones).
- `IngredientSelectorModal`: Modal de búsqueda y selección de ingredientes reutilizado en Diario y Recetas.
- `RecipeCard`: Tarjeta de receta con porciones, tags y desglose de macros por porción.
- `ExerciseCard`: Tarjeta de ejercicio con recálculo proporcional en vivo.
- `FastingTimerWidget`: Widget circular de ayuno con cronómetro por timestamp absoluto y fases metabólicas.
- `MoodSelector`: Selector horizontal interactivo de 1 a 5 caritas de Nutria.
- `QuickFoodInput`: Campo con parser de lenguaje natural para carga en lote.
- `DayCell`: Celda de día individual en el calendario con badges.

---

## Fase 3: Feature Profile & Onboarding Biométrico

> Generar con `npm run generate` -> `feature` (nombre: `profile`)

### 3.1. Utilidades Matemáticas

- `calculateBMR(weightKg, heightCm, ageYears)` (Mifflin-St Jeor).
- `calculateTDEE(bmr, activityLevel)`.
- `calculateTargetCalories(tdee, goalType, customDeficit)`.
- `calculateTargetMacros(targetCalories, weightKg, mode, gPerKgConfig, percentageConfig)`.
- `calculateBMI(weightKg, heightCm)`.

### 3.2. Componentes de Feature

- `ProfileForm`: Formulario reactivo de datos biométricos, configuración del ciclo (duración total y de sangrado) y modo dual de cálculo de macros.
- `ThemeSelector`: Selector visual de las 3 paletas de colores con previsualización en vivo.
- `BackupManager`: Exportar e importar base de datos a archivo JSON.

---

## Fase 4: Feature Inventory (Ingredientes & Recetario)

> Generar con `npm run generate` -> `feature` (nombre: `inventory`)

### 4.1. Componentes de Feature

- `IngredientList`: Lista de ingredientes con buscador, filtro de favoritos fijos arriba y paginación virtual.
- `IngredientFormModal`: Formulario de alta/edición de alimento con selector de imagen WebP comprimida y cálculo por 100g.
- `RecipeBuilder`: Constructor de recetas con agregador de ingredientes, selector de tags y cálculo por porción.
- `RecipeList`: Grilla de recetas con filtros por etiqueta ("Alto en proteína", "Snack", etc.).

---

## Fase 5: Feature Diary (Registro Diario & Baja Fricción)

> Generar con `npm run generate` -> `feature` (nombre: `diary`)

### 5.1. Componentes de Feature

- `DailyCalorieSummary`: Anillo circular con `Meta - Ingeridas + Ejercicio = Restantes`.
- `MealSlotCard`: Tarjeta para Desayuno, Almuerzo, Merienda, Snack y Cena (con Snapshot Pattern inmutable):
  - Botón *"Repetir comida de ayer"*.
  - Botón *"Añadir Receta / Favorito"*.
  - Lista de alimentos con macros individuales.
- `QuickFoodParserBar`: Parser de texto para ingresar ingredientes por lenguaje natural.
- `ExerciseLogger`: Registro y edición de entrenamientos con cálculo proporcional de kcal.
- `DailyMoodTracker`: Selector de ánimo 1 a 5 y notas de sensaciones físicas.
- `IntimacyPeriodToggles`: Toggles de "Nota de Amor" (❤️) e inicio/fin de período.

---

## Fase 6: Feature Calendar (Ciclo Menstrual & 4 Fases Hormonales)

> Generar con `npm run generate` -> `feature` (nombre: `calendar`)

### 6.1. Lógica del Ciclo

- `cycleEngine.ts`: Identificación de las 4 fases y proyección del próximo período según la duración personalizada de ciclo y sangrado.

### 6.2. Componentes de Feature

- `MenstrualCalendarGrid`: Grid mensual con sombreado de fases y badges por día.
- `DayDetailModal`: Modal resumen del día con acceso directo al diario correspondiente.
- `LutealPhaseAlertBanner`: Notificación emergente con sugerencia de ajuste calórico (+150-200 kcal).

---

## Fase 7: Feature Analytics (Correlaciones, Medidas & Racha)

> Generar con `npm run generate` -> `feature` (nombre: `analytics`)

### 7.1. Componentes de Feature

- `WeightVsCycleChart`: Gráfico de línea superponiendo la curva de peso con las fases menstruales.
- `MoodCorrelationChart`: Correlación entre puntuación de ánimo y déficit calórico.
- `AnthropometryTracker`: Formulario y gráfico histórico de medidas corporales (cintura, cadera, etc.).
- `HabitStreakCard`: Heatmap de días consecutivos de registro y cumplimiento.

---

## Fase 8: Layout Shell Responsive, PWA Offline & Verificación

### 8.1. Ensamble de Páginas ("Zero-Code Pages")

- `src/app/page.tsx` $\rightarrow$ Redirige o renderiza el Diario.
- `src/app/diary/page.tsx` $\rightarrow$ `<DiaryScreen />`.
- `src/app/calendar/page.tsx` $\rightarrow$ `<CalendarScreen />`.
- `src/app/ingredients/page.tsx` $\rightarrow$ `<InventoryScreen />`.
- `src/app/profile/page.tsx` $\rightarrow$ `<ProfileScreen />`.

### 8.2. PWA & Service Worker

- `public/manifest.json` con metadatos de PWA, colores de tema e íconos adaptativos.
- Cacheo offline de assets estáticos y páginas en Service Worker.

### 8.3. Verificación de Calidad

- Pruebas unitarias en Vitest para fórmulas matemáticas, motor de ciclo y parser de texto.
- Ejecución de validaciones: `npm run lint`, `npm run test`, `npm run build`.
