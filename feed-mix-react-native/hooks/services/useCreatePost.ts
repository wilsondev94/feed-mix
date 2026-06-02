import { useState } from "react";
import { Alert } from "react-native";
import { useCreatePostMutation } from "./useCreatePostMutation";
import { useHandleImagePicker } from "../useHandleImagePicker";

export const useCreatePost = () => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { mutate: createPostMutation, isPending: isCreating } =
    useCreatePostMutation({ setContent, setSelectedImage });

  const handleImagePicker = useHandleImagePicker(setSelectedImage);

  const createPost = () => {
    if (!content.trim() && !selectedImage) {
      Alert.alert(
        "Empty Post",
        "Please write something or add an image before posting!",
      );
      return;
    }

    const postData: { content: string; imageUri?: string } = {
      content: content.trim(),
    };

    if (selectedImage) postData.imageUri = selectedImage;

    createPostMutation(postData);
  };

  return {
    content,
    setContent,
    selectedImage,
    isCreating,
    pickImageFromGallery: () => handleImagePicker(false),
    takePhoto: () => handleImagePicker(true),
    removeImage: () => setSelectedImage(null),
    createPost,
  };
};
