import { QUERY_KEYS } from "@/constants/queryKeys";
import { useApiClient } from "@/lib/axiosClient";
import { deletePost } from "@/lib/services/postsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  const api = useApiClient();

  const { mutate: deletePostMutation } = useMutation({
    mutationFn: (postId: string) => deletePost(api, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
    },
  });

  const handleDeletePost = (postId: string) => deletePostMutation(postId);
  return { handleDeletePost };
};
