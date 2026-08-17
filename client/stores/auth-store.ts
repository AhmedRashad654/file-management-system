import { create } from "zustand";
import type { SafeUser } from "@/lib/api-types";

interface AuthState {
  user: SafeUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: SafeUser, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  updateUser: (partial: Partial<SafeUser>) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, accessToken) => {
    set({ user, accessToken, isAuthenticated: true });
  },

  setAccessToken: (token) => set({ accessToken: token }),

  updateUser: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : null,
    })),

  clearSession: () => {
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
