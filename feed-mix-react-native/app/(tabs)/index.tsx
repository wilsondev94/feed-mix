import SignOutButton from "@/components/SignOutButton";
import { useSyncClerkUserToDb } from "@/hooks/services/useSyncClerkUserToDb";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  useSyncClerkUserToDb();
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white">
        <Text>Home screen</Text>
        <SignOutButton />
      </View>
    </SafeAreaView>
  );
};
export default HomeScreen;
