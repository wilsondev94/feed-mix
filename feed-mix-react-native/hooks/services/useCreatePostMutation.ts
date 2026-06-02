import { API_ENDPOINTS } from "@/constants/apiEndPoints";
import { useApiClient } from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { Alert, Platform } from "react-native";

interface UseCreatePostMutationParams {
  setContent: Dispatch<SetStateAction<string>>;
  setSelectedImage: Dispatch<SetStateAction<string | null>>;
}

export const useCreatePostMutation = ({
  setContent,
  setSelectedImage,
}: UseCreatePostMutationParams) => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: { content: string; imageUri?: string }) => {
      const formData = new FormData();

      if (postData.content) formData.append("content", postData.content);

      if (postData.imageUri) {
        const uriParts = postData.imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1].toLowerCase();

        const mimeTypeMap: Record<string, string> = {
          png: "image/png",
          gif: "image/gif",
          webp: "image/webp",
        };
        const mimeType = mimeTypeMap[fileType] || "image/jpeg";

        if (Platform.OS === "web") {
          // fetch the image and convert to blob for web
          const response = await fetch(postData.imageUri);
          const blob = await response.blob();
          formData.append("image", blob, `image.${fileType}`);
        } else {
          formData.append("image", {
            uri: postData.imageUri,
            name: `image.${fileType}`,
            type: mimeType,
          } as unknown as Blob);
        }
      }

      return api.post(API_ENDPOINTS.posts, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      setContent("");
      setSelectedImage(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (Platform.OS === "web") {
        if (confirm("Post created successfully!")) {
        }
        return;
      }
      Alert.alert("Success", "Post created successfully!");
    },
    onError: () => {
      Alert.alert("Error", "Failed to create post. Please try again.");
    },
  });
};
