"use client";

import { Badge } from "@/components/Badge";
import { Drop, Plant, Sparkle, Moon, Heart } from "@phosphor-icons/react";
import { useProfile } from "@/features/profile";

export function CycleLegend() {
  const { profile } = useProfile();

  const periodDuration = profile?.periodDurationDays || 5;
  const totalDays = profile?.cycleLengthDays || 28;
  const ovulationDay = Math.round(totalDays / 2);

  const follicularStart = periodDuration + 1;
  const follicularEnd = Math.max(follicularStart, ovulationDay - 2);
  const ovulatoryStart = ovulationDay - 1;
  const ovulatoryEnd = ovulationDay + 1;
  const lutealStart = ovulationDay + 2;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs py-1">
      <Badge variant="menstrual" size="sm" icon={<Drop weight="fill" className="w-3 h-3" />}>
        Menstrual (Días 1-{periodDuration})
      </Badge>

      <Badge variant="follicular" size="sm" icon={<Plant weight="duotone" className="w-3 h-3" />}>
        Folicular (Días {follicularStart}-{follicularEnd})
      </Badge>

      <Badge variant="ovulation" size="sm" icon={<Sparkle weight="duotone" className="w-3 h-3" />}>
        Ovulatoria (Días {ovulatoryStart}-{ovulatoryEnd})
      </Badge>

      <Badge variant="luteal" size="sm" icon={<Moon weight="duotone" className="w-3 h-3" />}>
        Lútea (Días {lutealStart}-{totalDays})
      </Badge>

      <span className="inline-flex items-center gap-1 text-[11px] text-love-dark font-medium bg-love-light/60 px-2 py-0.5 rounded-full">
        <Heart weight="fill" className="w-3 h-3" />
        Nota de Amor
      </span>
    </div>
  );
}
