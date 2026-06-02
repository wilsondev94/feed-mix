import { useGetPosts } from "@/hooks/services/useGetPosts";
import { Post } from "@/types/api-types";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import PostCard from "./PostCard";

const PostsList = ({ username }: { username?: string }) => {
  const { postsData, isLoading, error, refetch } = useGetPosts(username);

  if (isLoading) {
    return (
      <View className="p-8 items-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
        <Text className="text-gray-500 mt-2">Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500 mb-4">Failed to load posts</Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => refetch()}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (postsData?.posts.length === 0) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500">No posts yet</Text>
      </View>
    );
  }

  return (
    <>
      {postsData?.posts.map((post: Post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </>
  );
};

export default PostsList;
