import { colors } from "@/constants/colors";
import { Audio } from "expo-av";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 48,
    gap: 32,
    marginTop: 32,
  },
  heading: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    textTransform: "capitalize",
    color: colors.green,
    width: "100%",
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: colors.green,
    borderRadius: 9999,
    backgroundColor: colors.white,
  },
});

interface RecorderProps {
  onRecordingComplete?: (file: {
    uri: string;
    name: string;
    type: string;
  }) => Promise<void>;
  recordingOptions?: Partial<Audio.RecordingOptions>;
}

export function Recorder({
  onRecordingComplete,
  recordingOptions = Audio.RecordingOptionsPresets.HIGH_QUALITY,
}: RecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        ...recordingOptions,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          ...recordingOptions.android,
          extension: ".mp3",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
      });
      setRecording(recording);
    } catch (err) {
      console.log("Recording failed:", err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    try {
      const uri = recording.getURI();
      await recording.stopAndUnloadAsync();
      setRecording(null);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      if (uri && onRecordingComplete) {
        const fileName = uri.split("/").pop() || "audio.m4a";
        console.log("Recording completed:", fileName);
        console.log("File URI:", uri);

        await onRecordingComplete({
          uri,
          name: fileName,
          type: "audio/x-m4a",
        });
      }
    } catch (err: any) {
      console.log("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setRecording(null);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={recording ? stopRecording : startRecording}
        style={styles.button}
      >
        <Ionicons
          name={recording ? "stop" : "play"}
          size={100}
          color={colors.green}
        />
      </Pressable>
      {!recording && (
        <Text style={styles.heading}>Tap to record recitation</Text>
      )}
    </View>
  );
}
