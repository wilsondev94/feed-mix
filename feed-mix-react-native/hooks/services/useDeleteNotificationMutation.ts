import { API_ENDPOINTS } from "@/constants/apiEndPoints";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useApiClient } from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteNotificationMutation = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const { mutate: deleteNotification } = useMutation({
    mutationFn: (notificationId: string) =>
      api.delete(API_ENDPOINTS.deleteNotification(notificationId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications] }),
  });

  return {
    deleteNotification,
  };
};

export default useDeleteNotificationMutation;
