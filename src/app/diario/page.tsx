"use client";

import { useState } from "react";
import { Plus, Barbell, Trash, PencilSimple } from "@phosphor-icons/react";
import {
  useDiary,
  MEAL_SLOTS,
  MealSlotCard,
  AddFoodToMealModal,
  EditMealItemModal,
  ExerciseLoggerModal,
  FastingWidget,
  MoodWellnessCard,
  LutealPhaseAlert,
} from "@/features/diary";
import { DateNavigator } from "@/components/DateNavigator";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { CircularProgress } from "@/components/CircularProgress";
import { MacroProgressBar } from "@/components/MacroProgressBar";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import type { MealType, LoggedFoodItem, ExerciseEntry } from "@/types/database";

export default function DiarioPage() {
  const {
    selectedDate,
    setSelectedDate,
    dailyLog,
    summary,
    cycleInfo,
    fastingSession,
    logFoodItem,
    logRecipeServing,
    logMultipleItemsToMeal,
    reorderMealItems,
    removeMealItem,
    updateMealItemQuantity,
    logExercise,
    updateExercise,
    removeExercise,
    startFasting,
    endFasting,
    setMood,
    toggleLoveNote,
    togglePeriod,
    applyLutealAdjustment,
    lutealAdjustmentKcal,
  } = useDiary();

  const [activeMealModal, setActiveMealModal] = useState<{
    type: MealType;
    title: string;
  } | null>(null);

  const [editingItem, setEditingItem] = useState<{
    mealType: MealType;
    mealTitle: string;
    item: LoggedFoodItem;
  } | null>(null);

  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseEntry | null>(null);

  // Porcentaje de calorías consumidas vs meta
  const caloriePercentage = summary.targetCalories > 0
    ? Math.min(100, Math.round((summary.ingestedCalories / summary.targetCalories) * 100))
    : 0;

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6 pb-28">
      {/* 1. Barra de Navegación de Fechas con Badge de Fase Menstrual */}
      <DateNavigator
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        badge={
          <Badge
            variant={
              cycleInfo.phase === "menstrual"
                ? "menstrual"
                : cycleInfo.phase === "follicular"
                ? "follicular"
                : cycleInfo.phase === "ovulatory"
                ? "ovulation"
                : "luteal"
            }
            size="sm"
          >
            {cycleInfo.phaseName} (Día {cycleInfo.cycleDay}/{cycleInfo.totalCycleDays})
          </Badge>
        }
      />

      {/* 2. Banner de Alerta en Fase Lútea (Si está activa) */}
      <LutealPhaseAlert
        cycleInfo={cycleInfo}
        isApplied={lutealAdjustmentKcal > 0}
        onApply={(amt) => applyLutealAdjustment(amt)}
        onRevert={() => applyLutealAdjustment(0)}
      />

      {/* 3. Panel Consolidado de Calorías y Macronutrientes */}
      <Card variant="elevated" padding="lg" className="flex flex-col md:flex-row items-center gap-6">
        {/* Anillo de Calorías */}
        <div className="shrink-0 flex flex-col items-center text-center">
          <CircularProgress
            value={caloriePercentage}
            size={140}
            strokeWidth={10}
            color="var(--color-primary)"
          >
            <span className="text-[11px] font-semibold text-text-muted uppercase">Restantes</span>
            <span className="font-display font-bold text-2xl text-text-main my-0.5">
              {summary.remainingCalories}
            </span>
            <span className="text-[11px] text-text-muted">kcal</span>
          </CircularProgress>

          <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
            <span>
              Ingeridas: <strong className="text-text-main">{summary.ingestedCalories}</strong>
            </span>
            <span>•</span>
            <span>
              Quemadas: <strong className="text-secondary-text">+{summary.burnedCalories}</strong>
            </span>
          </div>
        </div>

        {/* Barras de Macronutrientes */}
        <div className="flex-1 w-full flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-xs text-text-muted uppercase tracking-wider">
              Macronutrientes del Día
            </span>
            <span className="text-xs text-text-muted">
              Meta: <strong>{summary.targetCalories} kcal</strong>
            </span>
          </div>

          <MacroProgressBar
            currentCarbsG={summary.ingestedCarbsG}
            targetCarbsG={summary.targetCarbsG}
            currentProteinG={summary.ingestedProteinG}
            targetProteinG={summary.targetProteinG}
            currentFatG={summary.ingestedFatG}
            targetFatG={summary.targetFatG}
          />
        </div>
      </Card>

      {/* 4. Las 5 Ranuras de Comidas */}
      <section aria-label="Comidas del Día" className="flex flex-col gap-3">
        <h2 className="font-display font-bold text-lg text-text-main">
          Registro de Comidas
        </h2>

        {MEAL_SLOTS.map((config) => (
          <MealSlotCard
            key={config.type}
            config={config}
            items={dailyLog.meals[config.type] || []}
            onAddFood={(type) =>
              setActiveMealModal({
                type,
                title: config.title,
              })
            }
            onRemoveItem={removeMealItem}
            onEditItem={(type, item) =>
              setEditingItem({
                mealType: type,
                mealTitle: config.title,
                item,
              })
            }
            onReorderItems={reorderMealItems}
          />
        ))}
      </section>

      {/* 5. Registro de Ejercicio */}
      <Card variant="elevated" padding="md" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary-light text-secondary-text flex items-center justify-center">
              <Barbell weight="duotone" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-text-main">
                Actividad & Entrenamiento
              </h3>
              <span className="text-xs text-text-muted">
                {dailyLog.exercises?.length
                  ? `${summary.burnedCalories} kcal quemadas hoy`
                  : "Suma tus sesiones de gym o cardio"}
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus weight="bold" className="w-3.5 h-3.5" />}
            onClick={() => setIsExerciseModalOpen(true)}
          >
            Registrar Ejercicio
          </Button>
        </div>

        {dailyLog.exercises && dailyLog.exercises.length > 0 ? (
          <div className="flex flex-col gap-2 pt-1">
            {dailyLog.exercises.map((ex) => (
              <div
                key={ex.id}
                className="flex items-center justify-between p-2.5 bg-surface-hover/50 rounded-button border border-border/40 text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-text-main">{ex.name}</span>
                  <span className="text-text-muted">
                    {ex.durationMinutes} minutos —{" "}
                    <strong className="text-secondary-text">+{ex.caloriesBurned} kcal</strong>
                  </span>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  <IconButton
                    icon={<PencilSimple weight="bold" className="w-3.5 h-3.5 text-text-muted hover:text-primary" />}
                    aria-label="Editar ejercicio"
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingExercise(ex)}
                  />
                  <IconButton
                    icon={<Trash weight="bold" className="w-3.5 h-3.5 text-text-muted hover:text-menstrual" />}
                    aria-label="Eliminar ejercicio"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeExercise(ex.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-muted/70 italic py-1">
            No has registrado entrenamientos hoy.
          </p>
        )}
      </Card>

      {/* 6. Widget de Ayuno Intermitente */}
      <FastingWidget
        session={fastingSession}
        onStart={startFasting}
        onEnd={endFasting}
      />

      {/* 7. Estado de Ánimo, Nota de Amor y Menstruación */}
      <MoodWellnessCard
        moodScore={dailyLog.moodScore}
        moodNote={dailyLog.moodNote}
        hasLoveNote={dailyLog.hasLoveNote}
        isPeriodActive={dailyLog.isPeriodActive}
        onSetMood={setMood}
        onToggleLoveNote={toggleLoveNote}
        onTogglePeriod={togglePeriod}
      />

      {/* Modales */}
      {activeMealModal && (
        <AddFoodToMealModal
          isOpen={Boolean(activeMealModal)}
          onClose={() => setActiveMealModal(null)}
          mealType={activeMealModal.type}
          mealTitle={activeMealModal.title}
          onLogFood={logFoodItem}
          onLogRecipe={logRecipeServing}
          onLogMultiple={logMultipleItemsToMeal}
        />
      )}

      {editingItem && (
        <EditMealItemModal
          isOpen={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          mealType={editingItem.mealType}
          mealTitle={editingItem.mealTitle}
          item={editingItem.item}
          onSaveQuantity={updateMealItemQuantity}
        />
      )}

      {(isExerciseModalOpen || editingExercise) && (
        <ExerciseLoggerModal
          isOpen={Boolean(isExerciseModalOpen || editingExercise)}
          onClose={() => {
            setIsExerciseModalOpen(false);
            setEditingExercise(null);
          }}
          onLogExercise={logExercise}
          onUpdateExercise={updateExercise}
          initialExercise={editingExercise}
        />
      )}
    </main>
  );
}
