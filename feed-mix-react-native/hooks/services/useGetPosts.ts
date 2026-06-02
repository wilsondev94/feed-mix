import { QUERY_KEYS } from "@/constants/queryKeys";
import { useApiClient } from "@/lib/axiosClient";
import { getPosts, getUserPosts } from "@/lib/services/postsApi";
import { useQuery } from "@tanstack/react-query";

export const useGetPosts = (username?: string) => {
  const api = useApiClient();

  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: username ? [QUERY_KEYS.userPosts, username] : [QUERY_KEYS.posts],
    queryFn: () => (username ? getUserPosts(api, username) : getPosts(api)),
  });

  return {
    postsData,
    isLoading,
    error,
    refetch,
  };
};
