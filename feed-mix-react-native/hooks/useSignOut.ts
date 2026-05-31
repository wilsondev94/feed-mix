import { useClerk } from "@clerk/expo";
import { Alert, Platform } from "react-native";

export const useSignOut = () => {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    if (Platform.OS === "web") {
      if (confirm("Are you sure you want to logout?")) {
        signOut();
      }
      return;
    }

    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  return { handleSignOut };
};
