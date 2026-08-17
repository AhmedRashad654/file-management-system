import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import type { LoginData } from "@/services/auth.service";

export function useLogin() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: ({ data }) => {
      setAuth(data.user, data.accessToken);
    },
  });
}
