export const API_ENDPOINTS = {
  syncUser: "/users/create-user",
  getCurrentUser: "/users/me",
  posts: "/posts/create-post",
  getPosts: "/posts",
  getUserPosts: (username: string) => `/posts/user/${username}`,
  likePost: (postId: string) => `/posts/${postId}/like`,
};
