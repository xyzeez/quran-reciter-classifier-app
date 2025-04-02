import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import * as DocumentPicker from "expo-document-picker";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 280,
    height: 360,
    marginTop: 32,
    padding: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.green,
    borderRadius: 30,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: colors.black,
    textAlign: "center",
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    width: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 8,
    backgroundColor: colors.greenLight,
  },
  fileText: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: colors.black,
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    alignItems: "center",
    bottom: -24,
    insetInline: 0,
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 164,
    height: 48,
    borderRadius: 9999,
    backgroundColor: colors.green,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: colors.white,
  },
});

interface UploaderProps {
  onFileUpload: (file: {
    uri: string;
    name: string;
    type: string;
  }) => Promise<void>;
  acceptedFileTypes?: string[];
}

export function Uploader({
  onFileUpload,
  acceptedFileTypes = ["audio/*"],
}: UploaderProps) {
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    uri: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadedFile = async () => {
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

  const deleteUploadedFile = () => setUploadedFile(null);

  const handleFileUpload = async () => {
    if (!uploadedFile) return;

    try {
      setIsUploading(true);
      console.log("Uploading file:", uploadedFile.name);

      await onFileUpload({
        uri: uploadedFile.uri,
        name: uploadedFile.name,
        type: "audio/mpeg",
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
    <Pressable onPress={handleUploadedFile} style={styles.container}>
      {!uploadedFile && (
        <>
          <Image
            source={icons.upload}
            tintColor={colors.green}
            style={styles.icon}
          />
          <Text style={styles.text}>Select a Quran audio file (MP3, WAV)</Text>
        </>
      )}
      {uploadedFile && (
        <>
          <Image
            source={icons.uploaded}
            tintColor={colors.green}
            style={styles.icon}
          />
          <View style={styles.inner}>
            <Text style={styles.fileText}>{uploadedFile.name}</Text>
            <Pressable onPress={deleteUploadedFile}>
              <Image
                source={icons.delete}
                tintColor={colors.red}
                style={styles.deleteIcon}
              />
            </Pressable>
          </View>
        </>
      )}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button]}
          onPress={uploadedFile ? handleFileUpload : handleUploadedFile}
          disabled={isUploading}
        >
          <Text style={styles.buttonText}>
            {isUploading
              ? "Processing..."
              : uploadedFile
                ? "Identify Reciter"
                : "Choose Audio File"}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
