import { QUERY_KEYS } from "@/constants/queryKeys";
import { useApiClient } from "@/lib/axiosClient";
import { likePost } from "@/lib/services/postsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLikePostMutation = () => {
  const api = useApiClient();

  const queryClient = useQueryClient();

  const { mutate: likePostMutation } = useMutation({
    mutationFn: (postId: string) => likePost(api, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
    },
  });

  const toggleLike = (postId: string) => likePostMutation(postId);

  return {
    toggleLike,
  };
};
