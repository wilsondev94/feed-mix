import { QUERY_KEYS } from "@/constants/queryKeys";
import { useApiClient } from "@/lib/axiosClient";
import { getNotifications } from "@/lib/services/notificationApi";
import { useQuery } from "@tanstack/react-query";

export const useNotifications = () => {
  const api = useApiClient();

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: [QUERY_KEYS.notifications],
    queryFn: () => getNotifications(api),
  });

  return {
    notifications: notificationsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  };
};
