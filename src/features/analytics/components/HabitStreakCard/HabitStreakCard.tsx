"use client";

import { Fire, Trophy, CheckCircle, CalendarCheck } from "@phosphor-icons/react";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import type { HabitStreakStats } from "../../types";

interface HabitStreakCardProps {
  stats: HabitStreakStats;
}

export function HabitStreakCard({ stats }: HabitStreakCardProps) {
  return (
    <Card variant="elevated" padding="md" className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#F4A261]/20 text-[#E76F51] flex items-center justify-center">
          <Fire weight="fill" className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-base text-text-main">
            Constancia & Racha de Hábitos
          </h3>
          <span className="text-xs text-text-muted">
            Cada día registrado construye tu adherencia
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Racha Actual"
          value={`${stats.currentStreak} días`}
          icon={<Fire weight="fill" className="w-5 h-5 text-[#E76F51]" />}
          subtitle="Días seguidos activos"
        />

        <StatCard
          title="Mejor Racha"
          value={`${stats.longestStreak} días`}
          icon={<Trophy weight="duotone" className="w-5 h-5 text-[#F4A261]" />}
          subtitle="Récord personal"
        />

        <StatCard
          title="Días Totales"
          value={`${stats.totalLoggedDays}`}
          icon={<CalendarCheck weight="duotone" className="w-5 h-5 text-primary-text" />}
          subtitle="Entradas en el diario"
        />

        <StatCard
          title="Cumplimiento"
          value={`${stats.complianceRatePercent}%`}
          icon={<CheckCircle weight="duotone" className="w-5 h-5 text-secondary-text" />}
          subtitle="En rango calórico"
        />
      </div>
    </Card>
  );
}
