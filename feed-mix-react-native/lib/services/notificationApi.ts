import { API_ENDPOINTS } from "@/constants/apiEndPoints";
import { Notification } from "@/types/api-types";
import { AxiosInstance } from "axios";

export const getNotifications = async (
  api: AxiosInstance,
): Promise<Notification[]> => {
  const res = await api.get(API_ENDPOINTS.getNotifications);
  return res.data.notifications;
};
