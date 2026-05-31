import SignOutButton from "@/components/SignOutButton";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
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
