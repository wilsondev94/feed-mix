import { NotificationTypeMap } from "@/types/api-types";

export const getNotificationText = (
  notificationType: string,
  firstName: string,
  lastName: string,
) => {
  const name = `${firstName} ${lastName}`;
  switch (notificationType) {
    case NotificationTypeMap.LIKE:
      return `${name} liked your post`;
    case NotificationTypeMap.COMMENT:
      return `${name} commented on your post`;
    case NotificationTypeMap.FOLLOW:
      return `${name} started following you`;
    default:
      return "";
  }
};
