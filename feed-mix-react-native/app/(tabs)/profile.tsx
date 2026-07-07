import PostsList from "@/components/PostList";
import SignOutButton from "@/components/SignOutButton";
import { useGetCurrentUser } from "@/hooks/services/useGetCurrentUser";
import { useGetPosts } from "@/hooks/services/useGetPosts";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Profile = () => {
  const insets = useSafeAreaInsets();
  const {
    currentUser,
    isLoading,
    refetch: refetchProfile,
  } = useGetCurrentUser();
  const {
    postsData: userPosts,
    refetch: refetchPosts,
    isLoading: isRefetching,
  } = useGetPosts(currentUser?.data.user.username);

  console.log("PROFILE", userPosts);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <View>
          <Text className="text-xl font-bold text-gray-900">
            {currentUser?.data.user.firstName} {currentUser?.data.user.lastName}
          </Text>
          <Text className="text-gray-500 text-sm">
            {userPosts?.posts?.length} Posts
          </Text>
        </View>
        <SignOutButton />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetchProfile();
              refetchPosts();
            }}
            tintColor="#1DA1F2"
          />
        }
      >
        <Image
          source={{
            uri:
              currentUser?.data.user.bannerImage ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          className="w-full h-48"
          resizeMode="cover"
        />

        <View className="px-4 pb-4 border-b border-gray-100">
          <View className="flex-row justify-between items-end -mt-16 mb-4">
            <Image
              source={{ uri: currentUser?.data.user.profilePicture }}
              className="size-32 rounded-full border-4 border-white"
            />
          </View>

          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Text className="text-xl font-bold text-gray-900 mr-1">
                {currentUser?.data.user.firstName}{" "}
                {currentUser?.data.user.lastName}
              </Text>
              <Feather
                name="check-circle"
                size={15}
                color="#1DA1F2"
                className="pl-2"
              />
            </View>
            <Text className="text-gray-500 mb-2">
              @{currentUser?.data.user.username}
            </Text>
            <Text className="text-gray-900 mb-3">
              {currentUser?.data.user.bio}
            </Text>

            <View className="flex-row items-center mb-2">
              <Feather name="map-pin" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">
                {currentUser?.data.user.location}
              </Text>
            </View>

            <View className="flex-row items-center mb-3">
              <Feather name="calendar" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">
                Joined{" "}
                {currentUser?.data.user &&
                  format(
                    new Date(currentUser.data.user.createdAt),
                    "MMMM yyyy",
                  )}
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity className="mr-6">
                <Text className="text-gray-900">
                  <Text className="font-bold">
                    {currentUser?.data.user.following.length}
                  </Text>
                  <Text className="text-gray-500"> Following</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-gray-900">
                  <Text className="font-bold">
                    {currentUser?.data.user.followers.length}
                  </Text>
                  <Text className="text-gray-500"> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <PostsList username={currentUser?.data.user.username} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
