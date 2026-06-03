import { useGetCurrentUser } from "@/hooks/services/useGetCurrentUser";
import { usePostComment } from "@/hooks/services/usePostComment";
import { Post } from "@/types/api-types";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";

interface CommentsModalProps {
  selectedPost: Post | null | undefined;
  onClose: () => void;
}

const CommentsModal = ({ selectedPost, onClose }: CommentsModalProps) => {
  const [commentText, setCommentText] = useState("");
  const { currentUser } = useGetCurrentUser();
  const { postCommentMutation, isPostingComment } =
    usePostComment(setCommentText);

  const handleClose = () => {
    onClose();
    setCommentText("");
  };

  return (
    <Modal
      visible={!!selectedPost}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      {/* MODAL HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={handleClose}>
          <Feather
            name="x-circle"
            size={18}
            className="text-blue-500 text-lg"
          />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Comments</Text>
        <View className="w-12" />
      </View>

      {selectedPost && (
        <ScrollView className="flex-1">
          {/* ORIGINAL POST */}
          <View className="border-b border-gray-100 bg-white p-4">
            <View className="flex-row">
              <Image
                source={{ uri: selectedPost.user.profilePicture }}
                className="size-12 rounded-full mr-3"
              />

              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="font-bold text-gray-900 mr-1">
                    {selectedPost.user.firstName} {selectedPost.user.lastName}
                  </Text>
                  <Text className="text-gray-500 ml-1">
                    @{selectedPost.user.username}
                  </Text>
                </View>

                {selectedPost.content && (
                  <Text className="text-gray-900 text-base leading-5 mb-3">
                    {selectedPost.content}
                  </Text>
                )}

                {selectedPost.image && (
                  <Image
                    source={{ uri: selectedPost.image }}
                    className="w-full h-48 rounded-2xl mb-3"
                    resizeMode="cover"
                  />
                )}
              </View>
            </View>
          </View>

          {/* ADD COMMENT INPUT */}

          <View className="p-4 border-t border-gray-100">
            <View className="flex-row">
              <Image
                source={{ uri: currentUser?.data.user.profilePicture }}
                className="size-10 rounded-full mr-3"
              />

              <View className="flex-1">
                <TextInput
                  className="text-gray-900 text-base rounded-md px-2 py-1 bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  className={`px-4 py-2 rounded-lg self-start ${
                    commentText.trim() ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onPress={() =>
                    postCommentMutation({
                      postId: selectedPost._id,
                      content: commentText,
                    })
                  }
                  disabled={isPostingComment || !commentText.trim()}
                >
                  {isPostingComment ? (
                    <ActivityIndicator size={"small"} color={"white"} />
                  ) : (
                    <Text
                      className={`font-semibold ${
                        commentText.trim() ? "text-white" : "text-gray-500"
                      }`}
                    >
                      Reply
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* COMMENTS LIST */}
          {selectedPost.comments.toReversed().map((comment) => (
            <View
              key={comment._id}
              className="border-b border-gray-100 bg-white p-4"
            >
              <View className="flex-row">
                <Image
                  source={{ uri: comment.user.profilePicture }}
                  className="w-10 h-10 rounded-full mr-3"
                />

                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="font-bold text-gray-900 mr-1">
                      {comment.user.firstName} {comment.user.lastName}
                    </Text>
                    <Text className="text-gray-500 text-sm ml-1">
                      @{comment.user.username}
                    </Text>
                  </View>

                  <Text className="text-gray-900 text-base leading-5 mb-2">
                    {comment.content}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </Modal>
  );
};

export default CommentsModal;
