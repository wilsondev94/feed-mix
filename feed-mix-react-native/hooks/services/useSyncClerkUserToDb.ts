import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "@/lib/axiosClient";
import { useAuth } from "@clerk/expo";
import { AxiosResponse } from "axios";
import { syncClerkUserToDb } from "@/lib/services/userApi";

export interface SyncUserApiResponse {
  message: string;
}

export const useSyncClerkUserToDb = () => {
  const { isSignedIn } = useAuth();
  const api = useApiClient();

  const { mutate, data } = useMutation<
    AxiosResponse<{ message: SyncUserApiResponse }>
  >({
    mutationFn: () => syncClerkUserToDb(api),
    onSuccess: (res) =>
      console.log("User synced successfully:", res.data.message),
    onError: (error) => console.log("User sync failed:", error),
  });

  // auto-sync user when signed in
  useEffect(() => {
    // if user is signed in and user is not synced yet, sync user
    if (isSignedIn && !data) {
      mutate();
    }
  }, [isSignedIn, data, mutate]);

  return null;
};
