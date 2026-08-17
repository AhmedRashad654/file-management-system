import { create } from "zustand";
import type { SafeUser } from "@/lib/api-types";

interface AuthState {
  user: SafeUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: SafeUser, accessToken: string) => void;
  setAccessToken: (token: string) => void;
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

  clearSession: () => {
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
