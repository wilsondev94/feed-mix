import { API_ENDPOINTS } from "@/constants/apiEndPoints";
import { Posts } from "@/types/api-types";
import { AxiosInstance } from "axios";

export const getPosts = async (api: AxiosInstance): Promise<Posts> => {
  const res = await api.get(API_ENDPOINTS.getPosts);
  return res.data;
};

export const getUserPosts = (
  api: AxiosInstance,
  username: string,
): Promise<Posts> => api.get(API_ENDPOINTS.getUserPosts(username));

export const likePost = async (api: AxiosInstance, postId: string) =>
  api.post(API_ENDPOINTS.likePost(postId));
