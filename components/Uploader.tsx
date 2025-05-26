import colors from "@/constants/colors";
import * as DocumentPicker from "expo-document-picker";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { UploaderProps } from "@/types/audio";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    maxWidth: 350,
    minHeight: 250,
    marginTop: 48,
    padding: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.green + "80",
    borderRadius: 20,
    backgroundColor: colors.white + "80",
  },
  promptContainer: {
    alignItems: "center",
    gap: 16,
  },
  promptText: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: colors.green,
    textAlign: "center",
  },
  fileInfoContainer: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  fileDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.green + "40",
    borderRadius: 12,
    backgroundColor: colors.greenLight,
  },
  fileText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: colors.black,
  },
  identifyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.green,
    marginTop: 16,
    gap: 8,
  },
  identifyButtonDisabled: {
    backgroundColor: colors.greyLight,
  },
  identifyButtonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: colors.white,
  },
});

const Uploader = ({
  onFileUpload,
  acceptedFileTypes = ["audio/*", "video/*"],
}: UploaderProps) => {
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    uri: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectFile = async () => {
    if (isUploading || uploadedFile) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: acceptedFileTypes,
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        setUploadedFile({
          name: file.name,
          uri: file.uri,
        });
      }
    } catch (err) {
      console.log("Document picker error:", err);
    }
  };

  const deleteUploadedFile = () => {
    if (isUploading) return;
    setUploadedFile(null);
  };

  const handleIdentifyPress = async () => {
    if (!uploadedFile || isUploading) return;

    try {
      setIsUploading(true);
      console.log("Uploading file:", uploadedFile.name);

      const fileExtension = uploadedFile.name.split(".").pop()?.toLowerCase();
      let mimeType = "audio/mpeg";
      if (fileExtension === "wav") mimeType = "audio/wav";
      if (fileExtension === "m4a") mimeType = "audio/x-m4a";
      if (fileExtension === "mp4") mimeType = "video/mp4";
      if (fileExtension === "mov") mimeType = "video/quicktime";

      await onFileUpload({
        uri: uploadedFile.uri,
        name: uploadedFile.name,
        type: mimeType,
      });

      setUploadedFile(null);
    } catch (err: any) {
      console.log("Upload error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Pressable
      onPress={handleSelectFile}
      style={styles.container}
      disabled={isUploading}
    >
      {!uploadedFile ? (
        <View style={styles.promptContainer}>
          <Ionicons
            name="cloud-upload-outline"
            size={80}
            color={colors.green}
          />
          <Text style={styles.promptText}>
            Tap to select an audio or video file (MP3, WAV, M4A, MP4, MOV)
          </Text>
        </View>
      ) : (
        <View style={styles.fileInfoContainer}>
          {(() => {
            const fileExtension = uploadedFile.name
              .split(".")
              .pop()
              ?.toLowerCase();
            const isVideo = fileExtension === "mp4" || fileExtension === "mov";
            return (
              <Ionicons
                name={isVideo ? "film-outline" : "musical-notes-outline"}
                size={80}
                color={colors.green}
              />
            );
          })()}
          <View style={styles.fileDetailsRow}>
            <Text
              style={styles.fileText}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {uploadedFile.name}
            </Text>
            <Pressable onPress={deleteUploadedFile} disabled={isUploading}>
              <Ionicons
                name="close-circle"
                size={24}
                color={isUploading ? colors.grey : colors.red}
              />
            </Pressable>
          </View>
          <Pressable
            style={[
              styles.identifyButton,
              isUploading && styles.identifyButtonDisabled,
            ]}
            onPress={handleIdentifyPress}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color={colors.green} />
            ) : (
              <Text style={styles.identifyButtonText}>Identify</Text>
            )}
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};

export default Uploader;
