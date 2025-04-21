import colors from "@/constants/colors";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useState } from "react";
import InputMethodToggle from "@/components/InputMethodToggle";
import Recorder from "@/components/Recorder";
import Uploader from "@/components/Uploader";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingInline: 16,
    paddingTop: 48,
    marginBottom: 96,
    minHeight: "100%",
    backgroundColor: colors.crest,
  },
  heading: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    textTransform: "capitalize",
    color: colors.green,
    width: "100%",
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: colors.black,
    textAlign: "center",
  },
});

const Index = () => {
  const [fileInputType, setFileInputType] = useState<"record" | "upload">(
    "record"
  );
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileProcess = async (file: {
    uri: string;
    name: string;
    type: string;
  }) => {
    try {
      setIsProcessing(true);
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: file.uri },
        { shouldPlay: false }
      );
      if (status.isLoaded && status.durationMillis !== undefined) {
        const duration = status.durationMillis / 1000;
        console.log(`Original audio duration: ${duration} seconds`);

        await sound.unloadAsync(); // Unload the sound after checking duration

        if (duration < 5) {
          alert("Audio file is too short. Minimum length is 5 seconds.");
          setIsProcessing(false);
          return;
        }

        console.log("Proceeding with the original file.");

        router.push({
          pathname: "/(modals)/ReciterPrediction",
          params: {
            file: JSON.stringify(file),
          },
        });
      } else {
        console.error("Failed to load audio file or duration is undefined.");
        await sound.unloadAsync(); // Attempt to unload even if status is bad
      }
    } catch (error: any) {
      console.error("Error processing file:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Identify the Qari</Text>
      <Text style={styles.text}>
        Record or upload an audio file to identify the reciter
      </Text>
      <InputMethodToggle
        fileInputType={fileInputType}
        setFileInputType={setFileInputType}
      />
      {fileInputType === "record" && (
        <Recorder onRecordingComplete={handleFileProcess} />
      )}
      {fileInputType === "upload" && (
        <Uploader onFileUpload={handleFileProcess} />
      )}
      {isProcessing && <ActivityIndicator size="large" color={colors.green} />}
    </View>
  );
};

export default Index;
