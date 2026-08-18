import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import { usersKeys } from "./use-users";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}
