import { QUERY_KEYS } from "@/constants/queryKeys";
import { useApiClient } from "@/lib/axiosClient";
import { updateUserProfile } from "@/lib/services/userApi";
import { FormData } from "@/types/api-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Platform } from "react-native";

interface UseProfileParams {
  setIsEditModalVisible: (value: boolean) => void;
}
export const useProfile = ({ setIsEditModalVisible }: UseProfileParams) => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (profileData: FormData) => updateUserProfile(api, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.authUser] });
      setIsEditModalVisible(false);

      if (Platform.OS === "web") {
        alert("Profile updated successfully!");
        return;
      }
      Alert.alert("Success", "Profile updated successfully!");
    },
    onError: (error: any) => {
      if (Platform.OS === "web") {
        alert(error.response?.data?.error || "Failed to update profile");
        return;
      }

      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update profile",
      );
    },
  });

  return {
    saveProfile: mutate,
    isUpdating: isPending,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.authUser] }),
  };
};
