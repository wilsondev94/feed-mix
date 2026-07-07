export const API_ENDPOINTS = {
  syncUser: "/users/create-user",
  getCurrentUser: "/users/me",
  posts: "/posts/create-post",
  getPosts: "/posts",
  getUserPosts: (username: string) => `/posts/user/${username}`,
  likePost: (postId: string) => `/posts/${postId}/like`,
  deletePost: (postId: string) => `/posts/${postId}`,
  postComment: (postId: string) => `/comment/post/${postId}`,
  getNotifications: "/notifications",
  deleteNotification: (notificationId: string) =>
    `/notifications/${notificationId}`,
};
