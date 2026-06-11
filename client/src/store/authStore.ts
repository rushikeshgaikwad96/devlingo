import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  updateXP: (xp: number) => void;
  updateStreak: (streak: number) => void;
  updateHearts: (hearts: number) => void;
  updateUserFields: (fields: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),

  setUser: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  updateXP: (xp) =>
    set((state) => ({
      user: state.user ? { ...state.user, xp } : null,
    })),

  updateStreak: (streak) =>
    set((state) => ({
      user: state.user ? { ...state.user, streak } : null,
    })),

  updateHearts: (hearts) =>
    set((state) => ({
      user: state.user ? { ...state.user, hearts } : null,
    })),

  updateUserFields: (fields) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...fields } : null,
    })),
}));