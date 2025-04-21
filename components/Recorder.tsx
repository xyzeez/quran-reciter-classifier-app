import colors from "@/constants/colors";
import { Audio } from "expo-av";
import { Pressable, StyleSheet, Text, View, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RecorderProps } from "@/types/audio";

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
  timerText: {
    fontSize: 20,
    fontFamily: "Poppins_500Medium",
    color: colors.grey,
    marginTop: 8,
    minWidth: 60,
    textAlign: "center",
  },
  buttonContainer: {
    position: "relative",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
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
    zIndex: 1,
  },
  pulse: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 9999,
    backgroundColor: colors.green + "50",
    zIndex: 0,
  },
});

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${paddedMinutes}:${paddedSeconds}`;
};

const Recorder = ({
  onRecordingComplete,
  recordingOptions = Audio.RecordingOptionsPresets.HIGH_QUALITY,
  maxDurationSeconds,
}: RecorderProps) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (recording) {
      pulseAnimationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimationRef.current.start();

      setRecordingDuration(0);
      intervalRef.current = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          const newDuration = prevDuration + 1;
          if (maxDurationSeconds && newDuration >= maxDurationSeconds) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);
    } else {
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
        pulseAnimationRef.current = null;
      }
      pulseAnim.setValue(1);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setRecordingDuration(0);
    }

    return () => {
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
        pulseAnimationRef.current = null;
      }
      pulseAnim.setValue(1);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [recording, pulseAnim]);

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
    if (!recording || intervalRef.current === null) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const currentRecording = recording;
    setRecording(null);

    try {
      const uri = currentRecording.getURI();
      console.log("Stopping and unloading recording...");
      await currentRecording.stopAndUnloadAsync();
      console.log("Recording stopped and unloaded.");

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      if (uri && onRecordingComplete) {
        const fileName = uri.split("/").pop() || "audio.m4a";
        console.log("Recording completed (max duration or manual):", fileName);
        console.log("File URI:", uri);

        await onRecordingComplete({
          uri,
          name: fileName,
          type: "audio/x-m4a",
        });
      }
    } catch (err: any) {
      console.error("Error during stopRecording:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {recording && (
          <Animated.View
            style={[
              styles.pulse,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        )}
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
      </View>
      {recording ? (
        <Text style={styles.timerText}>
          {formatDuration(recordingDuration)}
        </Text>
      ) : (
        <Text style={styles.heading}>Tap to record recitation</Text>
      )}
    </View>
  );
};

export default Recorder;
