"use client";

import { Badge } from "@/components/Badge";
import { Drop, Plant, Sparkle, Moon, Heart } from "@phosphor-icons/react";

export function CycleLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs py-1">
      <Badge variant="menstrual" size="sm" icon={<Drop weight="fill" className="w-3 h-3" />}>
        Menstrual (Días 1-5)
      </Badge>

      <Badge variant="follicular" size="sm" icon={<Plant weight="duotone" className="w-3 h-3" />}>
        Folicular (Días 6-13)
      </Badge>

      <Badge variant="ovulation" size="sm" icon={<Sparkle weight="duotone" className="w-3 h-3" />}>
        Ovulatoria (Días 14-16)
      </Badge>

      <Badge variant="luteal" size="sm" icon={<Moon weight="duotone" className="w-3 h-3" />}>
        Lútea (Días 17-28)
      </Badge>

      <span className="inline-flex items-center gap-1 text-[11px] text-love-dark font-medium bg-love-light/60 px-2 py-0.5 rounded-full">
        <Heart weight="fill" className="w-3 h-3" />
        Nota de Amor
      </span>
    </div>
  );
}
