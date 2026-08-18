import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import { usersKeys } from "./use-users";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: "USER" | "ADMIN" }) =>
      usersService.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}
