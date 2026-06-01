import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "@/lib/axiosClient";
import { useAuth } from "@clerk/expo";
import { userApi } from "@/lib/services";
import { AxiosResponse } from "axios";

export interface SyncUserApiResponse {
  message: string;
}

export const useSyncClerkUserToDb = () => {
  const { isSignedIn } = useAuth();
  const api = useApiClient();

  console.log("IS SIGNED IN", isSignedIn);

  const { mutate, data } = useMutation<
    AxiosResponse<{ message: SyncUserApiResponse }>
  >({
    mutationFn: () => userApi.syncClerkUserToDb(api),
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
