"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CookingPot,
  BowlFood,
  Calendar,
  ChartLineUp,
  User,
} from "@phosphor-icons/react";
import { NutriaMascot } from "../NutriaMascot";
import type { NavItem, NavigationShellProps } from "./NavigationShell.types";

const NAV_ITEMS: NavItem[] = [
  { label: "Diario", href: "/diario", iconName: "BookOpen" },
  { label: "Recetas", href: "/recetas", iconName: "CookingPot" },
  { label: "Alimentos", href: "/alimentos", iconName: "BowlFood" },
  { label: "Calendario", href: "/calendario", iconName: "Calendar" },
  { label: "Métricas", href: "/metricas", iconName: "ChartLineUp" },
  { label: "Perfil", href: "/perfil", iconName: "User" },
];

function getNavIcon(name: NavItem["iconName"], isActive: boolean) {
  const props = {
    weight: isActive ? ("fill" as const) : ("duotone" as const),
    className: `w-5 h-5 transition-transform ${
      isActive ? "text-primary-text scale-110" : "text-text-muted hover:text-text-main"
    }`,
  };

  switch (name) {
    case "BookOpen":
      return <BookOpen {...props} />;
    case "CookingPot":
      return <CookingPot {...props} />;
    case "BowlFood":
      return <BowlFood {...props} />;
    case "Calendar":
      return <Calendar {...props} />;
    case "ChartLineUp":
      return <ChartLineUp {...props} />;
    case "User":
      return <User {...props} />;
  }
}

export function NavigationShell({ children }: NavigationShellProps) {
  const pathname = usePathname();

  const isCurrentActive = (href: string) => {
    if (!pathname) return href === "/diario";
    if (href === "/diario") {
      return pathname === "/" || pathname === "/diario";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-main">
      {/* 1. Header Desktop (md:flex) */}
      <header className="sticky top-0 z-40 hidden md:flex items-center justify-between px-6 py-3 bg-surface/85 backdrop-blur-md border-b border-border transition-colors">
        {/* Logo & Marca */}
        <Link href="/diario" className="flex items-center gap-2.5 group">
          <NutriaMascot state="mood5" size="sm" />
          <span className="font-display font-bold text-2xl text-text-main tracking-tight group-hover:text-primary-text transition-colors">
            Nutria
          </span>
        </Link>

        {/* Links de Navegación Desktop */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isCurrentActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-button text-xs font-semibold transition-all ${
                  active
                    ? "bg-primary text-primary-text font-bold shadow-2xs"
                    : "text-text-muted hover:text-text-main hover:bg-surface-hover"
                }`}
              >
                {getNavIcon(item.iconName, active)}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* 2. Contenido Principal */}
      <div className="flex-1 w-full">{children}</div>

      {/* 3. Bottom Navigation Bar Mobile (md:hidden) */}
      <nav
        aria-label="Navegación Móvil"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface/90 backdrop-blur-lg border-t border-border flex items-center justify-around py-2 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        {NAV_ITEMS.map((item) => {
          const active = isCurrentActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-button transition-all ${
                active
                  ? "text-primary-text font-bold"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              {getNavIcon(item.iconName, active)}
              <span
                className={`text-[10px] mt-0.5 transition-colors ${
                  active ? "font-bold text-text-main" : "text-text-muted"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
