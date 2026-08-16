# 🦦 Nutria — Nutrition & Cycle-Aware Wellness Tracker

> **Nutria** es una aplicación web integral de nutrición consciente, gestión de macronutrientes y bienestar integral. Diseñada con un enfoque **Offline-First**, combina el cálculo calórico y macronutricional avanzado con la **sincronización del ciclo menstrual femenino**, el seguimiento del ayuno intermitente y el cálculo científico del gasto energético en actividad física.

---

## 🌟 Características Principales

### 1. 📔 Diario Nutricional Inteligente (5 Comidas)

- **Ranuras del Día:** Desayuno, Almuerzo, Merienda, Cena y Snacks adicionales.
- **Selección Múltiple y Guardado en Lote (*Staged Items*):** Permite elegir múltiples alimentos y porciones de recetas simultáneamente en una bandeja interactiva antes de guardar en lote.
- **Ajuste Interactivo de Porciones:** Vista previa en tiempo real de calorías y desglose de macronutrientes (Proteínas, Carbohidratos, Grasas) al ajustar gramos o porciones.
- **Reordenamiento Drag & Drop:** Arrastre táctil y con cursor mediante `Framer Motion` para reordenar los alimentos dentro de cada comida con persistencia automática en base de datos.
- **Edición y Eliminación Rápida:** Botón de edición directa (`PencilSimple`) para ajustar porciones de alimentos ya registrados y botón de eliminación (`Trash`).
- **Patrón Snapshot (Inmutabilidad):** Los alimentos registrados en el diario se guardan como instantáneas inmutables con sus valores nutricionales calculados, preservando el historial aunque el ingrediente base sea editado a futuro.

### 2. 🏃‍♂️ Actividad Física & Gasto Energético Científico

- **Cálculo Basado en METs y Peso Corporal:** Utiliza los equivalentes metabólicos del *Compendio de Actividades Físicas (Ainsworth et al.)* adaptados al peso exacto del usuario:
  $$\text{kcal quemadas} = \text{MET} \times \text{Peso corporal (kg)} \times \left(\frac{\text{Minutos}}{60}\right)$$
- **6 Presets Optimizados:**
  - 🏋️ **Pesas (MET 5.5):** Fuerza y musculación con descansos.
  - ⚡ **Cardio / HIIT (MET 8.5):** Circuitos de alta intensidad.
  - 🚶 **Caminata 3km/h (MET 2.8):** Paseo suave / regenerativo (~3.2 km/h).
  - 🏃 **Running (MET 9.0):** Trote / carrera continua (~8.5 km/h).
  - 🧘 **Pilates (MET 3.8):** Mat o reformer y control postural.
  - 🎶 **Baile (MET 7.3):** Baile continuo intenso (techno / rave / jodita), equivalente al ciclismo moderado (7.5 METs).
- **Sumatoria al Presupuesto Diario:** Las calorías quemadas se integran automáticamente al balance energético del día.

### 3. 🌸 Salud Femenina & Sincronización Hormonal

- **Detección Automática de Fases:** Calcula la fase del ciclo (Folicular, Ovulación, Lútea, Menstrual) a partir de la duración del ciclo y la fecha del último período.
- **Alerta & Ajuste de Fase Lútea:** Sugerencia inteligente de incremento calórico (+150 kcal) para compensar el gasto metabólico basal y reducir los antojos en la fase lútea tardía.
- **Registro de Bienestar Diario:** Escala de estado de ánimo (1 al 5), notas personales, interruptor de período activo y registro de "Notas de Amor" (*Love Notes*).

### 4. ⏳ Ayuno Intermitente en Tiempo Real

- **Temporizador de Ayuno:** Sesiones con metas configurables (12h, 14h, 16h).
- **Persistencia en Vivo:** Monitoreo del tiempo transcurrido y registro del tiempo total de ayuno completado en el log diario.

### 5. 🥑 Inventario de Alimentos & 🍲 Libro de Recetas

- **Catálogo de Ingredientes:** Carga de alimentos con gramos por porción, macronutrientes, fibra, marca, soporte para favoritos y fotos WebP comprimidas en base64.
- **Recetas Compuestas:** Creación de recetas a partir de ingredientes del inventario, con cálculo automático de totales y macros por porción según la cantidad de raciones.

### 6. 📅 Calendario Histórico & 📊 Métricas Antropométricas

- **Vista Calendario:** Navegación histórica día por día con anillos de progreso calórico, indicadores de período menstrual y estados de ánimo registrados.
- **Cálculo de BMR & TDEE:** Tasa Metabólica Basal con la ecuación de *Mifflin-St Jeor*, Gasto Energético Total con factores PAL y cálculo dual de macronutrientes (modo gramos por kg de peso o porcentajes).
- **Seguimiento Antropométrico:** Historial de peso corporal y medidas corporales (cintura, cadera, muslos, brazos, pecho).

---

## 🎨 Sistema de Diseño & Temas

Nutria implementa un sistema de diseño cálido, accesible y con estética premium:

- **Tipografía Editorial:** Encabezados en **`Fraunces`** (Serif cálida con personalidad) y cuerpo en **`Poppins`** (Sans-serif geométrica de alta legibilidad).
- **3 Temas Semánticos Dinámicos:**
  - 🍵 **Matcha-Peach** (Default): Verdes matcha orgánicos con acentos durazno pastel.
  - 🔮 **Cyber-Lilac:** Tonos lavanda, lilas y contrastes oscuros modernos.
  - 🦦 **Warm-Otter:** Tonos tierra cálidos, arenas y marrones suaves.
- **Componentes Transversales Reutilizables:** `Modal`, `ConfirmModal`, `BottomSheet`, `SearchInput`, `NumberInput`, `SegmentedControl`, `CircularProgress`, `MacroProgressBar`, `StatCard`, `NutriaMascot`, `ToggleSwitch`, `ToastNotification`.

---

## 🏗️ Arquitectura del Software (Feature-Sliced Design)

El proyecto sigue una arquitectura **Feature-Sliced Design (FSD)** modular y **Offline-First**:

```text
src/
 ├── app/                      # Rutas de Next.js App Router
 │    ├── alimentos/           # Gestión del catálogo de ingredientes
 │    ├── calendario/          # Histórico mensual y logs pasados
 │    ├── diario/              # Vista principal del diario, comidas y ayuno
 │    ├── metricas/            # Antropometría y evolución física
 │    ├── perfil/              # Configuración de metas, BMR, TDEE y temas
 │    └── recetas/             # Creación y gestión de recetas compuestas
 ├── components/               # Componentes atómicos transversales compartidos
 ├── features/                 # Módulos de dominio aislados
 │    ├── analytics/           # Reportes y cálculo de tendencias
 │    ├── auth/                # Autenticación y estado de sesión
 │    ├── calendar/            # Lógica y hooks del calendario histórico
 │    ├── diary/               # Estado, modales y lógica del diario y comidas
 │    ├── foods/               # Hooks y operaciones de alimentos/ingredientes
 │    ├── profile/             # Metas calóricas, macros y perfil del usuario
 │    ├── recipes/             # Hooks y lógica de recetas
 │    └── sync/                # Sincronización Dexie <-> Firebase
 ├── lib/                      # Configuración de Dexie DB (IndexedDB local)
 ├── providers/                # Proveedores de contexto (Auth, Live Queries)
 ├── styles/                   # Tokens semánticos y configuración de globals.css
 ├── types/                    # Tipos TypeScript y modelos de base de datos
 └── utils/                    # Fórmulas de nutrición, ciclo menstrual y compresión
```

### 💾 Persistencia de Datos (Offline-First con Dexie.js)

Toda la información se almacena localmente en el navegador mediante **Dexie.js (IndexedDB)** en 6 tablas principales:

- `userProfile`: Configuración antropométrica, metas, tema y ciclo menstrual.
- `ingredients`: Catálogo personal de alimentos y macros.
- `recipes`: Recetas compuestas con desglose por porción.
- `dailyLogs`: Registro diario indexado por fecha `YYYY-MM-DD` (comidas inmutables, ejercicios, estado de ánimo, ayuno).
- `fastingSessions`: Sesión activa y estado de ayuno.
- `anthropometrics`: Historial de medidas y peso.

---

## 💻 Stack Tecnológico

| Categoría | Tecnología |
| --- | --- |
| **Framework** | Next.js 16 (App Router con Turbopack) & React 19 |
| **Lenguaje** | TypeScript |
| **Estilos & Tokens** | Tailwind CSS v4 con variables CSS semánticas |
| **Base de Datos Local** | Dexie.js (IndexedDB wrapper con `dexie-react-hooks`) |
| **Animaciones** | Framer Motion (Drag & Drop con `Reorder`, transiciones) |
| **Iconografía** | `@phosphor-icons/react` |
| **Testing** | Vitest & `@testing-library/react` (56 tests unitarios pasando) |
| **Generador de Código** | Plop.js (generadores para components, feature-components y pages) |
| **Calidad de Código** | ESLint 9, Prettier, Husky & lint-staged |

---

## 🚀 Guía de Instalación y Uso

### Prerrequisitos

- **Node.js**: v18.18.0 o superior
- **npm**: v9.0.0 o superior

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/nutria.git

# 2. Entrar al directorio
cd nutria

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---

## 📜 Scripts Disponibles

- `npm run dev` — Inicia el servidor de desarrollo en Turbopack.
- `npm run build` — Genera el build optimizado para producción.
- `npm run start` — Inicia el servidor de producción.
- `npm run lint` — Ejecuta ESLint para validar sintaxis y buenas prácticas.
- `npm run test` — Ejecuta la suite de pruebas unitarias con Vitest.
- `npm run generate` — Ejecuta los generadores de código de Plop.js para crear componentes o features bajo la arquitectura FSD.

---

## 🧪 Pruebas Automatizadas

El proyecto cuenta con una cobertura integral de pruebas unitarias sobre cálculos matemáticos, hooks y componentes de interfaz:

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar pruebas en modo observador (watch)
npx vitest
```

---

## 📌 Puntos Ciegos & Mejoras Futuras Identificadas

1. **Sincronización en la Nube (BaaS):** Conexión bidireccional de Dexie.js con Firestore mediante Cloud Functions para respaldo multidispositivo.
2. **Lector de Código de Barras:** Integración con la API de OpenFoodFacts mediante escaneo de cámara web/móvil.
3. **Exportación de Reportes PDF/CSV:** Generación de resúmenes nutricionales y antropométricos para nutricionistas y profesionales de la salud.
4. **PWA (Progressive Web App):** Service Worker y Web App Manifest para instalación nativa en dispositivos iOS y Android.
