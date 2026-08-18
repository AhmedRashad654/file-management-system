import { useQuery } from "@tanstack/react-query";
import { usersService, type ListUsersParams } from "@/services/users.service";

export const usersKeys = {
  all: ["users"] as const,
  list: (params: ListUsersParams) => [...usersKeys.all, "list", params] as const,
};

export function useUsers(params: ListUsersParams) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersService.list(params),
  });
}
