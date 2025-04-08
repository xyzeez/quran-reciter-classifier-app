import { colors } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { Toggle } from "@/components/Toggle";
import { Recorder } from "@/components/Recorder";
import { Uploader } from "@/components/Uploader";
import { reciterService } from "@/services/reciterService";
import { useRouter } from "expo-router";

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

export default function Index() {
  const [fileInputType, setFileInputType] = useState<"record" | "upload">(
    "record"
  );
  const router = useRouter();

  const handleFileProcess = async (file: {
    uri: string;
    name: string;
    type: string;
  }) => {
    try {
      const response = await reciterService.predictReciter(file);
      console.log("Server response:", JSON.stringify(response, null, 2));

      // Redirect to prediction results with the response data
      router.push({
        pathname: "/(modals)/prediction",
        params: {
          predictions: JSON.stringify(response),
        },
      });
    } catch (error: any) {
      console.error("Error processing file:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Identify the Qari</Text>
      <Text style={styles.text}>
        Record or upload an audio file to identify the reciter
      </Text>
      <Toggle
        fileInputType={fileInputType}
        setFileInputType={setFileInputType}
      />
      {fileInputType === "record" && (
        <Recorder onRecordingComplete={handleFileProcess} />
      )}
      {fileInputType === "upload" && (
        <Uploader onFileUpload={handleFileProcess} />
      )}
    </View>
  );
}
