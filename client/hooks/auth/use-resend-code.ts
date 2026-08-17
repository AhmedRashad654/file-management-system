import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import type { ResendCodeData } from "@/services/auth.service";

export function useResendCode() {
  return useMutation({
    mutationFn: (data: ResendCodeData) => authService.resendCode(data),
  });
}
