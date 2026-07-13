import { API_ENDPOINTS } from "@/constants/apiEndPoints";
import { CurrentUser, FormData } from "@/types/api-types";
import { AxiosInstance } from "axios";

export const syncClerkUserToDb = (api: AxiosInstance) =>
  api.post(API_ENDPOINTS.syncUser);

export const getCurrentUser = async (
  api: AxiosInstance,
): Promise<CurrentUser> => api.get(API_ENDPOINTS.getCurrentUser);

export const updateUserProfile = async (api: AxiosInstance, data: FormData) =>
  api.put(API_ENDPOINTS.updateUerProfile, data);
