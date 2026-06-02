import { QUERY_KEYS } from "@/constants/queryKeys";
import { useApiClient } from "@/lib/axiosClient";
import { getCurrentUser } from "@/lib/services/userApi";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentUser = () => {
  const api = useApiClient();

  const {
    data: currentUser,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.authUser],
    queryFn: () => getCurrentUser(api),
  });

  return { currentUser, isLoading, error, refetch };
};
