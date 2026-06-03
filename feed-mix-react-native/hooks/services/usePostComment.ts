import { QUERY_KEYS } from "@/constants/queryKeys";
import { useApiClient } from "@/lib/axiosClient";
import { postComment } from "@/lib/services/postsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const usePostComment = (
  setCommentText: React.Dispatch<React.SetStateAction<string>>,
) => {
  const api = useApiClient();

  const queryClient = useQueryClient();

  const { mutate: postCommentMutation, isPending: isPostingComment } =
    useMutation({
      mutationFn: ({ postId, content }: { postId: string; content: string }) =>
        postComment(api, postId, content),
      onSuccess: () => {
        setCommentText("");
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
      },
      onError: () => {
        Alert.alert("Error", "Failed to post comment. Try again.");
      },
    });

  return {
    postCommentMutation,
    isPostingComment,
  };
};
