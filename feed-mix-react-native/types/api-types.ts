export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  bannerImage: string;
  bio: string;
  location: string;
  createdAt: string;
  following: [];
  followers: [];
}

export interface CurrentUser {
  data: { user: User };
}

export interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface Post {
  _id: string;
  content: string;
  image?: string;
  createdAt: string;
  user: User;
  likes: string[];
  comments: Comment[];
}

export interface Posts {
  data: {
    posts: Post[];
  };
}

export const NotificationTypeMap = {
  LIKE: "like",
  COMMENT: "comment",
  FOLLOW: "follow",
} as const;

export type NotificationType =
  (typeof NotificationTypeMap)[keyof typeof NotificationTypeMap];

export interface Notification {
  _id: string;
  from: {
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  type: NotificationType;
  post?: {
    _id: string;
    content: string;
    image?: string;
  };
  comment?: {
    _id: string;
    content: string;
  };
  createdAt: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
}
