import { formatDate } from "@/lib/utils/formatters";
import { Notification, NotificationTypeMap } from "@/types/api-types";
import { Feather } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  const getNotificationText = () => {
    const name = `${notification.from.firstName} ${notification.from.lastName}`;
    switch (notification.type) {
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

  const getNotificationIcon = () => {
    switch (notification.type) {
      case NotificationTypeMap.LIKE:
        return <Feather name="heart" size={20} color="#E0245E" />;
      case NotificationTypeMap.COMMENT:
        return <Feather name="message-circle" size={20} color="#1DA1F2" />;
      case NotificationTypeMap.FOLLOW:
        return <Feather name="user-plus" size={20} color="#17BF63" />;
      default:
        return <Feather name="bell" size={20} color="#657786" />;
    }
  };

  return (
    <View className="border-b border-gray-100 bg-white">
      <View className="flex-row p-4">
        <View className="relative mr-3">
          <Image
            source={{ uri: notification.from.profilePicture }}
            className="size-12 rounded-full"
          />

          <View className="absolute -bottom-1 -right-1 size-6 bg-white items-center justify-center">
            {getNotificationIcon()}
          </View>
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-1">
            <View className="flex-1">
              <Text className="text-gray-900 text-base leading-5 mb-1">
                <Text className="font-semibold">
                  {notification.from.firstName} {notification.from.lastName}
                </Text>
                <Text className="text-gray-500">
                  {" "}
                  @{notification.from.username}
                </Text>
              </Text>
              <Text className="text-gray-700 text-sm mb-2">
                {getNotificationText()}
              </Text>
            </View>
          </View>

          {notification.post && (
            <View className="bg-gray-50 rounded-lg p-3 mb-2">
              <Text className="text-gray-700 text-sm mb-1" numberOfLines={3}>
                {notification.post.content}
              </Text>
              {notification.post.image && (
                <Image
                  source={{ uri: notification.post.image }}
                  className="w-full h-32 rounded-lg mt-2"
                  resizeMode="cover"
                />
              )}
            </View>
          )}

          {notification.comment && (
            <View className="bg-blue-50 rounded-lg p-3 mb-2">
              <Text className="text-gray-600 text-xs mb-1">Comment:</Text>
              <Text className="text-gray-700 text-sm" numberOfLines={2}>
                &ldquo;{notification.comment.content}&rdquo;
              </Text>
            </View>
          )}

          <Text className="text-gray-400 text-xs">
            {formatDate(notification.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default NotificationCard;
