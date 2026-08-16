"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { authApi, formatAuthErrorMessage } from "@/features/auth";
import { useSyncManager } from "@/features/sync";
import type { AuthState } from "@/features/auth/types";

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Activar orquestador de sincronización en tiempo real
  useSyncManager(user?.uid);

  useEffect(() => {
    let isMounted = true;

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          if (isMounted) {
            setUser(currentUser);
            setLoading(false);
          }
        },
        (err) => {
          if (isMounted) {
            console.warn("Firebase Auth listener error:", err);
            setError(formatAuthErrorMessage(err));
            setLoading(false);
          }
        }
      );

      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (err) {
      console.warn("Firebase corriendo en modo offline:", err);
      queueMicrotask(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    }
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await authApi.signInGoogle();
    } catch (err: unknown) {
      const msg = formatAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      await authApi.signInEmail(email, pass);
    } catch (err: unknown) {
      const msg = formatAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      await authApi.signUpEmail(email, pass);
    } catch (err: unknown) {
      const msg = formatAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setError(null);
    try {
      await authApi.resetPassword(email);
    } catch (err: unknown) {
      const msg = formatAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const signOutUser = async () => {
    setError(null);
    try {
      await authApi.logout();
    } catch (err: unknown) {
      const msg = formatAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const value = useMemo<AuthState>(
    () => ({
      user,
      userId: user?.uid || "current_user",
      loading,
      error,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      sendPasswordReset,
      signOutUser,
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de un <AuthProvider />");
  }
  return context;
}
