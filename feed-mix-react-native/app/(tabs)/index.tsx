import CreatePost from "@/components/CreatePost";
import SignOutButton from "@/components/SignOutButton";
import { useSyncClerkUserToDb } from "@/hooks/services/useSyncClerkUserToDb";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  useSyncClerkUserToDb();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        <Ionicons name="logo-x" size={24} color="#1DA1F2" />
        <Text className="text-xl font-bold text-gray-900">Home</Text>
        <SignOutButton />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={isRefetching}
        //     onRefresh={handlePullToRefresh}
        //     tintColor={"#1DA1F2"}
        //   />
        // }
      >
        <CreatePost />
        {/* <PostsList /> */}
      </ScrollView>
    </SafeAreaView>
  );
};
export default HomeScreen;
