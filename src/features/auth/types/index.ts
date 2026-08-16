import type { User } from "firebase/auth";

export interface AuthState {
  user: User | null;
  userId: string;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

export type AuthMode = "signin" | "signup" | "reset";
