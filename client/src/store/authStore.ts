import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  authModalOpen: boolean;
  authModalTab: "login" | "register";
  setAuthModal: (open: boolean, tab?: "login" | "register") => void;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  updateXP: (xp: number) => void;
  updateStreak: (streak: number) => void;
  updateHearts: (hearts: number) => void;
  updateUserFields: (fields: Partial<User>) => void;
}

const getStoredUser = (): User | null => {
  try {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem("token"),
  authModalOpen: false,
  authModalTab: "login",

  setAuthModal: (open, tab = "login") => set({ authModalOpen: open, authModalTab: tab }),

  setUser: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token, authModalOpen: false });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  updateXP: (xp) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, xp } : null;
      if (updatedUser) localStorage.setItem("user", JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),

  updateStreak: (streak) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, streak } : null;
      if (updatedUser) localStorage.setItem("user", JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),

  updateHearts: (hearts) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, hearts } : null;
      if (updatedUser) localStorage.setItem("user", JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),

  updateUserFields: (fields) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...fields } : null;
      if (updatedUser) localStorage.setItem("user", JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),
}));