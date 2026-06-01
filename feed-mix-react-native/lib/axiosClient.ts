import { useAuth } from "@clerk/expo";
import { AxiosInstance, create } from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// this will basically create an authenticated api, pass the token into our headers
export const axiosClient = (
  getToken: () => Promise<string | null>,
): AxiosInstance => {
  const api = create({ baseURL: API_BASE_URL });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return axiosClient(getToken);
};
