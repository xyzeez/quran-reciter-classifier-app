import colors from "@/constants/colors";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useState } from "react";
import InputMethodToggle from "@/components/InputMethodToggle";
import Recorder from "@/components/Recorder";
import Uploader from "@/components/Uploader";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import TabHeader from "@/components/TabHeader";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 96,
    backgroundColor: colors.crest,
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

        await sound.unloadAsync();

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
        await sound.unloadAsync();
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
    <SafeAreaView style={styles.container}>
      <TabHeader
        title="Identify the Qari"
        subtitle="Record or upload an audio file to identify the reciter"
      />
      <InputMethodToggle
        fileInputType={fileInputType}
        setFileInputType={setFileInputType}
      />
      {fileInputType === "record" && (
        <Recorder
          onRecordingComplete={handleFileProcess}
          maxDurationSeconds={15}
        />
      )}
      {fileInputType === "upload" && (
        <Uploader onFileUpload={handleFileProcess} />
      )}
      {isProcessing && <ActivityIndicator size="large" color={colors.green} />}
    </SafeAreaView>
  );
};

export default Index;
