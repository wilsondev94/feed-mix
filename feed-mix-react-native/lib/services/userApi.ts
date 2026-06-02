import { API_ENDPOINTS } from "@/constants/apiEndPoints";
import { AxiosInstance } from "axios";

export const syncClerkUserToDb = (api: AxiosInstance) =>
  api.post(API_ENDPOINTS.syncUser);
