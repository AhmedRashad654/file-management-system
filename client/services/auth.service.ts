import { apiClient } from "@/lib/axios";
import type { ApiResponse, AuthResponse, SafeUser } from "@/lib/api-types";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface ResendCodeData {
  email: string;
}

export const authService = {
  register: async (data: RegisterData) => {
    const res = await apiClient.post<ApiResponse<null>>("/auth/register", data);
    return res.data;
  },

  login: async (data: LoginData) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", data);
    return res.data;
  },

  verifyEmail: async (data: VerifyEmailData) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/verify-email", data);
    return res.data;
  },

  resendCode: async (data: ResendCodeData) => {
    const res = await apiClient.post<ApiResponse<null>>("/auth/resend-code", data);
    return res.data;
  },

  getProfile: async () => {
    const res = await apiClient.get<ApiResponse<SafeUser>>("/auth/profile");
    return res.data.data;
  },

  refresh: async (): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>("/auth/refresh");
    return res.data.data;
  },

  logout: async () => {
    const res = await apiClient.post<ApiResponse<null>>("/auth/logout");
    return res.data;
  },
};
