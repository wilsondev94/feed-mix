import * as ImagePicker from "expo-image-picker";
import { Dispatch, SetStateAction } from "react";
import { Alert } from "react-native";

export const useHandleImagePicker = (
  setSelectedImage: Dispatch<SetStateAction<string | null>>,
) => {
  const handleImagePicker = async (useCamera: boolean = false) => {
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== "granted") {
      const source = useCamera ? "camera" : "photo library";
      Alert.alert(
        "Permission needed",
        `Please grant permission to access your ${source}`,
      );
      return;
    }

    const pickerOptions = {
      allowsEditing: true,
      aspect: [16, 9] as [number, number],
      quality: 0.8,
    };

    const result = useCamera
      ? await ImagePicker.launchCameraAsync(pickerOptions)
      : await ImagePicker.launchImageLibraryAsync({
          ...pickerOptions,
          mediaTypes: ["images"],
        });

    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  return handleImagePicker;
};
