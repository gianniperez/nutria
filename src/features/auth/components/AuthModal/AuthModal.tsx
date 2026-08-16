"use client";

import { useState } from "react";
import { GoogleLogo, Envelope, Lock, WarningCircle, CheckCircle } from "@phosphor-icons/react";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { SegmentedControl } from "@/components/SegmentedControl";
import { useAuth } from "@/providers/AuthProvider";
import { NutriaMascot } from "@/components/NutriaMascot";
import type { AuthMode } from "../../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset } = useAuth();

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setLocalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setResetSuccess(false);

    if (!email.trim()) {
      setLocalError("Por favor ingresa tu correo electrónico.");
      return;
    }

    if (mode !== "reset" && (!password || password.length < 6)) {
      setLocalError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
        onClose();
      } else if (mode === "signup") {
        await signUpWithEmail(email, password);
        onClose();
      } else if (mode === "reset") {
        await sendPasswordReset(email);
        setResetSuccess(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setLocalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <NutriaMascot state="mood5" size="sm" />
          <span>
            {mode === "signin"
              ? "Iniciar Sesión"
              : mode === "signup"
              ? "Crear Cuenta en Nutria"
              : "Recuperar Contraseña"}
          </span>
        </div>
      }
      description="Sincroniza tus registros, recetas y ciclo menstrual en todos tus dispositivos."
      maxWidth="sm"
    >
      <div className="flex flex-col gap-4">
        {/* Selector de Modo (Login vs Registro) */}
        {mode !== "reset" && (
          <SegmentedControl
            name="auth-mode"
            options={[
              { value: "signin", label: "Iniciar Sesión" },
              { value: "signup", label: "Crear Cuenta" },
            ]}
            value={mode}
            onChange={(val) => {
              setMode(val as AuthMode);
              setLocalError(null);
            }}
          />
        )}

        {/* Botón de Google */}
        <Button
          type="button"
          variant="outline"
          size="md"
          isLoading={isSubmitting}
          leftIcon={<GoogleLogo weight="bold" className="w-5 h-5 text-[#4285F4]" />}
          onClick={handleGoogleSignIn}
          className="w-full justify-center"
        >
          Continuar con Google
        </Button>

        {/* Divisor */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-semibold text-text-muted uppercase">o con correo</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Formulario Email / Contraseña */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            label="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            leftIcon={<Envelope weight="duotone" className="w-4 h-4 text-text-muted" />}
            required
          />

          {mode !== "reset" && (
            <Input
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              leftIcon={<Lock weight="duotone" className="w-4 h-4 text-text-muted" />}
              required
            />
          )}

          {/* Enlaces secundarios */}
          {mode === "signin" && (
            <button
              type="button"
              onClick={() => {
                setMode("reset");
                setLocalError(null);
              }}
              className="text-xs text-text-muted hover:text-primary-text text-right underline cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}

          {mode === "reset" && (
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setLocalError(null);
              }}
              className="text-xs text-text-muted hover:text-primary-text text-left underline cursor-pointer"
            >
              ← Volver a Iniciar Sesión
            </button>
          )}

          {/* Banner de Error */}
          {localError && (
            <div className="p-2.5 rounded-button bg-menstrual-light/50 border border-menstrual/40 flex items-center gap-2 text-xs text-menstrual-dark">
              <WarningCircle weight="bold" className="w-4 h-4 shrink-0" />
              <span>{localError}</span>
            </div>
          )}

          {/* Mensaje de Éxito al Recuperar */}
          {resetSuccess && (
            <div className="p-2.5 rounded-button bg-secondary-light/50 border border-secondary/40 flex items-center gap-2 text-xs text-secondary-text">
              <CheckCircle weight="bold" className="w-4 h-4 shrink-0" />
              <span>Te enviamos un correo para restablecer tu contraseña. Revisa tu casilla.</span>
            </div>
          )}

          {/* Botón Principal */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            className="w-full mt-2 justify-center"
          >
            {mode === "signin"
              ? "Entrar a Nutria"
              : mode === "signup"
              ? "Crear mi Cuenta"
              : "Enviar Correo de Recuperación"}
          </Button>
        </form>
      </div>
    </Modal>
  );
}
