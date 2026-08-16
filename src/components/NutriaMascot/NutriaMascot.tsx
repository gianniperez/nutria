"use client";

import { motion } from "framer-motion";
import type { NutriaMascotProps, NutriaMoodState } from "./NutriaMascot.types";

const sizeStyles = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-36 h-36",
  xl: "w-48 h-48",
};

export function NutriaMascot({
  state,
  moodScore,
  isPeriodActive = false,
  isStreakActive = false,
  size = "md",
  className = "",
  animate = true,
}: NutriaMascotProps) {
  // Determinar estado de la nutria automáticamente según props si no se pasa explícito
  let resolvedState: NutriaMoodState = state || "mood4";

  if (!state) {
    if (isStreakActive) {
      resolvedState = "streak";
    } else if (isPeriodActive) {
      resolvedState = "menstrual";
    } else if (moodScore) {
      const moodMap: Record<number, NutriaMoodState> = {
        1: "mood1",
        2: "mood2",
        3: "mood3",
        4: "mood4",
        5: "mood5",
      };
      resolvedState = moodMap[moodScore] || "mood4";
    }
  }

  // Renderizado SVG Lineart según estado
  const renderOtterIllustration = () => {
    switch (resolvedState) {
      case "mood1":
        // Acurrucada con mantita
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xs">
            {/* Mantita suave */}
            <path
              d="M20 75 Q40 50 70 55 Q100 60 105 85 Q100 105 55 105 Q20 105 20 75 Z"
              fill="var(--color-secondary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Cabeza durmiendo */}
            <circle
              cx="45"
              cy="48"
              r="22"
              fill="var(--color-primary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3.5"
            />
            {/* Orejita */}
            <circle
              cx="30"
              cy="34"
              r="6"
              fill="var(--color-primary)"
              stroke="var(--color-text-main)"
              strokeWidth="3"
            />
            {/* Ojos cerrados Zzz */}
            <path
              d="M36 47 Q40 51 44 47"
              stroke="var(--color-text-main)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Hociquito y naricita */}
            <ellipse cx="54" cy="52" rx="7" ry="5" fill="#FFF" />
            <circle cx="54" cy="50" r="3" fill="var(--color-text-main)" />
            {/* Zzz floating */}
            <text
              x="75"
              y="35"
              fill="var(--color-text-muted)"
              fontSize="14"
              fontFamily="var(--font-display)"
              fontWeight="bold"
            >
              z
            </text>
            <text
              x="86"
              y="26"
              fill="var(--color-primary-dark)"
              fontSize="18"
              fontFamily="var(--font-display)"
              fontWeight="bold"
            >
              Z
            </text>
          </svg>
        );

      case "mood2":
        // Tomando té caliente
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xs">
            {/* Cuerpo */}
            <path
              d="M35 50 Q60 30 85 50 Q95 90 85 100 Q60 105 35 100 Q25 90 35 50 Z"
              fill="var(--color-primary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3.5"
            />
            {/* Cabeza */}
            <circle
              cx="60"
              cy="42"
              r="24"
              fill="var(--color-primary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3.5"
            />
            {/* Orejitas */}
            <circle cx="42" cy="24" r="6" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="3" />
            <circle cx="78" cy="24" r="6" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="3" />
            {/* Ojos serenos */}
            <path d="M50 40 Q53 43 56 40" stroke="var(--color-text-main)" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M64 40 Q67 43 70 40" stroke="var(--color-text-main)" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Nariz */}
            <circle cx="60" cy="46" r="3.5" fill="var(--color-text-main)" />
            {/* Tacita de té */}
            <rect
              x="50"
              y="70"
              width="20"
              height="16"
              rx="4"
              fill="var(--color-secondary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3"
            />
            {/* Humito de té */}
            <path
              d="M56 65 Q54 60 56 55"
              stroke="var(--color-secondary-dark)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M64 65 Q66 60 64 55"
              stroke="var(--color-secondary-dark)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        );

      case "mood3":
        // Flotando Zen boca arriba
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xs">
            {/* Onditas de agua */}
            <path
              d="M10 85 Q30 80 50 85 T90 85 T110 85"
              stroke="var(--color-secondary)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M20 95 Q40 90 60 95 T100 95"
              stroke="var(--color-secondary-dark)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cuerpo flotando horizontal */}
            <ellipse
              cx="60"
              cy="65"
              rx="35"
              ry="18"
              fill="var(--color-primary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3.5"
            />
            {/* Panza clarita */}
            <ellipse cx="60" cy="65" rx="22" ry="11" fill="#FFF8F2" />
            {/* Cabeza inclinada */}
            <circle
              cx="35"
              cy="52"
              r="16"
              fill="var(--color-primary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3.5"
            />
            {/* Orejita */}
            <circle cx="24" cy="42" r="4.5" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="2.5" />
            {/* Ojos felices cerrados */}
            <path d="M30 52 Q34 48 38 52" stroke="var(--color-text-main)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Nariz */}
            <circle cx="43" cy="50" r="2.5" fill="var(--color-text-main)" />
            {/* Patitas cruzadas en el pecho */}
            <circle cx="56" cy="60" r="4.5" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="2.5" />
            <circle cx="64" cy="60" r="4.5" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="2.5" />
          </svg>
        );

      case "mood5":
        // Enérgica con gafas de sol
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xs">
            {/* Rayos de sol chispeantes */}
            <path d="M60 10 L60 16" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
            <path d="M25 25 L30 30" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
            <path d="M95 25 L90 30" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
            {/* Cuerpo */}
            <ellipse
              cx="60"
              cy="75"
              rx="26"
              ry="26"
              fill="var(--color-primary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3.5"
            />
            {/* Cabeza */}
            <circle
              cx="60"
              cy="48"
              r="24"
              fill="var(--color-primary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3.5"
            />
            {/* Orejitas */}
            <circle cx="42" cy="30" r="6" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="3" />
            <circle cx="78" cy="30" r="6" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="3" />
            {/* Gafas de sol oscuras */}
            <rect x="42" y="42" width="16" height="11" rx="4" fill="var(--color-text-main)" />
            <rect x="62" y="42" width="16" height="11" rx="4" fill="var(--color-text-main)" />
            <path d="M57 46 L63 46" stroke="var(--color-text-main)" strokeWidth="3" />
            {/* Sonrisa audaz */}
            <path d="M54 60 Q60 66 66 60" stroke="var(--color-text-main)" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Brazos arriba enérgicos */}
            <path d="M36 70 Q24 55 30 45" stroke="var(--color-text-main)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M84 70 Q96 55 90 45" stroke="var(--color-text-main)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case "menstrual":
        // Con bolsita de agua caliente y chocolate
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xs">
            {/* Cuerpo */}
            <ellipse
              cx="60"
              cy="70"
              rx="26"
              ry="26"
              fill="var(--color-primary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3.5"
            />
            {/* Cabeza */}
            <circle
              cx="60"
              cy="44"
              r="22"
              fill="var(--color-primary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3.5"
            />
            {/* Orejitas */}
            <circle cx="44" cy="28" r="5.5" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="3" />
            <circle cx="76" cy="28" r="5.5" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="3" />
            {/* Ojos agradecidos / tiernos */}
            <path d="M51 42 Q54 45 57 42" stroke="var(--color-text-main)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M63 42 Q66 45 69 42" stroke="var(--color-text-main)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            {/* Nariz */}
            <circle cx="60" cy="48" r="3" fill="var(--color-text-main)" />
            {/* Bolsita de agua caliente roja/coral abrazada */}
            <rect
              x="48"
              y="64"
              width="24"
              height="22"
              rx="6"
              fill="var(--color-menstrual)"
              stroke="var(--color-text-main)"
              strokeWidth="3"
            />
            {/* Tapón de la bolsa */}
            <rect x="56" y="59" width="8" height="5" rx="2" fill="var(--color-menstrual-dark)" stroke="var(--color-text-main)" strokeWidth="2" />
            <path d="M53 72 L67 72" stroke="#FFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            {/* Manitos abrazando */}
            <circle cx="46" cy="74" r="5" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="2.5" />
            <circle cx="74" cy="74" r="5" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="2.5" />
          </svg>
        );

      case "streak":
        // Celebrando con cinta y pesa
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xs">
            {/* Destellos de éxito */}
            <path d="M25 35 L30 40" stroke="var(--color-love)" strokeWidth="3" strokeLinecap="round" />
            <path d="M95 35 L90 40" stroke="var(--color-love)" strokeWidth="3" strokeLinecap="round" />
            {/* Cuerpo */}
            <ellipse
              cx="60"
              cy="74"
              rx="26"
              ry="26"
              fill="var(--color-primary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3.5"
            />
            {/* Cabeza */}
            <circle
              cx="60"
              cy="45"
              r="23"
              fill="var(--color-primary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3.5"
            />
            {/* Cinta deportiva en la frente */}
            <path d="M40 37 Q60 33 80 37" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Orejitas */}
            <circle cx="43" cy="28" r="5.5" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="3" />
            <circle cx="77" cy="28" r="5.5" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="3" />
            {/* Ojos brillantes */}
            <circle cx="53" cy="45" r="3" fill="var(--color-text-main)" />
            <circle cx="67" cy="45" r="3" fill="var(--color-text-main)" />
            {/* Sonrisa alegre */}
            <path d="M54 52 Q60 57 66 52" stroke="var(--color-text-main)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            {/* Pesa levantada */}
            <rect x="85" y="55" width="16" height="5" rx="2" fill="var(--color-text-main)" />
            <rect x="82" y="50" width="5" height="15" rx="2" fill="var(--color-secondary-dark)" />
            <rect x="99" y="50" width="5" height="15" rx="2" fill="var(--color-secondary-dark)" />
          </svg>
        );

      case "mood4":
      default:
        // Contenta, sonriente y acogedora (Default)
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xs">
            {/* Cuerpo */}
            <ellipse
              cx="60"
              cy="74"
              rx="28"
              ry="26"
              fill="var(--color-primary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3.5"
            />
            {/* Pechito blanco */}
            <ellipse cx="60" cy="76" rx="16" ry="16" fill="#FFF9F5" />
            {/* Cabeza */}
            <circle
              cx="60"
              cy="44"
              r="24"
              fill="var(--color-primary-light)"
              stroke="var(--color-text-main)"
              strokeWidth="3.5"
            />
            {/* Orejitas */}
            <circle cx="42" cy="27" r="6" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="3" />
            <circle cx="78" cy="27" r="6" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="3" />
            {/* Ojos amigables con brillo */}
            <circle cx="52" cy="42" r="3.5" fill="var(--color-text-main)" />
            <circle cx="53" cy="41" r="1.2" fill="#FFF" />
            <circle cx="68" cy="42" r="3.5" fill="var(--color-text-main)" />
            <circle cx="69" cy="41" r="1.2" fill="#FFF" />
            {/* Hociquito blanco */}
            <ellipse cx="60" cy="50" rx="9" ry="6" fill="#FFF9F5" stroke="var(--color-text-main)" strokeWidth="1.5" />
            {/* Nariz */}
            <ellipse cx="60" cy="47.5" rx="3.5" ry="2.5" fill="var(--color-text-main)" />
            {/* Sonrisita */}
            <path d="M57 52 Q60 55 63 52" stroke="var(--color-text-main)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Rubor en mejillas */}
            <ellipse cx="45" cy="47" rx="3" ry="2" fill="var(--color-love)" opacity="0.6" />
            <ellipse cx="75" cy="47" rx="3" ry="2" fill="var(--color-love)" opacity="0.6" />
            {/* Patitas suaves en el pecho */}
            <circle cx="51" cy="72" r="5" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="2.5" />
            <circle cx="69" cy="72" r="5" fill="var(--color-primary)" stroke="var(--color-text-main)" strokeWidth="2.5" />
          </svg>
        );
    }
  };

  if (!animate) {
    return (
      <div className={`inline-block select-none ${sizeStyles[size]} ${className}`}>
        {renderOtterIllustration()}
      </div>
    );
  }

  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={`inline-block select-none ${sizeStyles[size]} ${className}`}
    >
      {renderOtterIllustration()}
    </motion.div>
  );
}
