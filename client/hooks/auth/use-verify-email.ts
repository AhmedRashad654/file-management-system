import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import type { VerifyEmailData } from "@/services/auth.service";

export function useVerifyEmail() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: VerifyEmailData) => authService.verifyEmail(data),
    onSuccess: ({data}) => {
      setAuth(data.user, data.accessToken);
    },
  });
}
