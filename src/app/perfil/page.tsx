"use client";

import { useState } from "react";
import { useProfile } from "@/features/profile";
import {
  BiometricSummary,
  ProfileForm,
  MenstrualSettings,
  ThemeSelector,
} from "@/features/profile";
import { useAuth } from "@/providers/AuthProvider";
import { AuthModal } from "@/features/auth";
import { syncApi } from "@/features/sync";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import {
  UserCircle,
  SignOut,
  CloudCheck,
  WarningCircle,
  UserPlus,
  ArrowsClockwise,
  CheckCircle,
} from "@phosphor-icons/react";

export default function PerfilPage() {
  const { profile, isLoading, updateProfile, bmr, tdee, bmiInfo, macros } =
    useProfile();

  const { user, signOutUser, error: authError } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [manualSyncMessage, setManualSyncMessage] = useState<string | null>(
    null,
  );

  const handleManualSync = async () => {
    if (!user) return;
    setIsManualSyncing(true);
    setManualSyncMessage(null);
    try {
      await syncApi.syncBidirectional(user.uid);
      setManualSyncMessage("¡Datos sincronizados exitosamente con Firestore!");
      setTimeout(() => setManualSyncMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al sincronizar";
      setManualSyncMessage(`Error: ${msg}`);
    } finally {
      setIsManualSyncing(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
        <SkeletonLoader variant="card" count={3} />
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6 flex flex-col gap-6 pb-24">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-main">
          Tu Perfil
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          Ajusta tus parámetros corporales, objetivos metabólicos y salud
          hormonal.
        </p>
      </header>

      {/* 0. Cuenta & Sincronización en la Nube (Firebase Auth) */}
      <section aria-label="Cuenta y Sincronización">
        <Card variant="elevated" padding="md" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary-light text-primary-text flex items-center justify-center shrink-0">
                <UserCircle weight="duotone" className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-display font-bold text-base text-text-main">
                  Cuenta
                </h3>
              </div>
            </div>

            {user ? (
              <Badge
                variant="primary"
                size="sm"
                icon={<CloudCheck weight="bold" className="w-3.5 h-3.5" />}
              >
                Sincronización Activa
              </Badge>
            ) : (
              <Badge variant="neutral" size="sm">
                Modo Local-First
              </Badge>
            )}
          </div>

          {user ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-surface-hover/70 rounded-card border border-border/60">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "Usuario"}
                      className="w-10 h-10 rounded-full border border-primary/40 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-text flex items-center justify-center font-bold">
                      {(user.displayName || user.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-text-main">
                      {user.displayName || "Usuario de Nutria"}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      {user.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    isLoading={isManualSyncing}
                    leftIcon={
                      <ArrowsClockwise weight="bold" className="w-3.5 h-3.5" />
                    }
                    onClick={handleManualSync}
                  >
                    Sincronizar Ahora
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<SignOut weight="bold" className="w-3.5 h-3.5" />}
                    onClick={signOutUser}
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              </div>

              {manualSyncMessage && (
                <div className="flex items-center gap-2 p-2.5 rounded-button bg-secondary-light/60 border border-secondary/40 text-xs text-secondary-text animate-fade-in">
                  <CheckCircle weight="bold" className="w-4 h-4 shrink-0" />
                  <span>{manualSyncMessage}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-surface-hover/60 rounded-card border border-border/60">
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-xs text-text-main">
                  Inicia sesión para respaldar en Firebase Cloud
                </span>
                <p className="text-[11px] text-text-muted">
                  Tus datos locales de recetas y diarios se migrarán
                  automáticamente a tu cuenta en la nube.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<UserPlus weight="bold" className="w-4 h-4" />}
                onClick={() => setIsAuthModalOpen(true)}
              >
                Ingresar / Registrarse
              </Button>
            </div>
          )}

          {authError && (
            <div className="flex items-center gap-2 p-2.5 rounded-button bg-menstrual-light/40 border border-menstrual/40 text-xs text-menstrual-dark">
              <WarningCircle weight="bold" className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}
        </Card>
      </section>

      {/* 1. Resumen Biométrico y Objetivo Calórico */}
      <section aria-label="Resumen Biométrico">
        <BiometricSummary
          profile={profile}
          bmr={bmr}
          tdee={tdee}
          bmiInfo={bmiInfo}
          macros={macros}
        />
      </section>

      {/* 2. Selector de Tema de Color Dinámico */}
      <section aria-label="Selector de Tema">
        <ThemeSelector
          currentTheme={profile.selectedTheme}
          onThemeSelect={(selectedTheme) => updateProfile({ selectedTheme })}
        />
      </section>

      {/* 3. Configuración del Ciclo Menstrual */}
      <section aria-label="Configuración de Ciclo Menstrual">
        <MenstrualSettings
          cycleLengthDays={profile.cycleLengthDays}
          periodDurationDays={profile.periodDurationDays}
          lastPeriodDate={profile.lastPeriodDate}
          onUpdate={updateProfile}
        />
      </section>

      {/* 4. Formulario Biométrico y de Actividad */}
      <section aria-label="Formulario de Perfil">
        <ProfileForm profile={profile} onSave={updateProfile} />
      </section>

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </main>
  );
}
