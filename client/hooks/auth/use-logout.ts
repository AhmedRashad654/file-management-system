import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";

export function useLogout() {
  const queryClient = useQueryClient();
  const { clearSession } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
