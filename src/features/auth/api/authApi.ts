import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export function formatAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return "Ocurrió un error inesperado al autenticar.";

  const message = error.message;

  if (message.includes("auth/invalid-email")) {
    return "El correo electrónico ingresado no es válido.";
  }
  if (message.includes("auth/user-not-found") || message.includes("auth/wrong-password") || message.includes("auth/invalid-credential")) {
    return "Correo o contraseña incorrectos.";
  }
  if (message.includes("auth/email-already-in-use")) {
    return "Ya existe una cuenta con este correo electrónico.";
  }
  if (message.includes("auth/weak-password")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  if (message.includes("auth/popup-closed-by-user")) {
    return "Se cerró la ventana de autenticación de Google.";
  }

  return message;
}

export const authApi = {
  async signInGoogle() {
    return await signInWithPopup(auth, googleProvider);
  },

  async signInEmail(email: string, pass: string) {
    return await signInWithEmailAndPassword(auth, email, pass);
  },

  async signUpEmail(email: string, pass: string) {
    return await createUserWithEmailAndPassword(auth, email, pass);
  },

  async resetPassword(email: string) {
    return await sendPasswordResetEmail(auth, email);
  },

  async logout() {
    return await signOut(auth);
  },
};
