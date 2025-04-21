import colors from "@/constants/colors";
import { StyleSheet, View } from "react-native";
import Recorder from "@/components/Recorder";
import { useRouter } from "expo-router";
import TabHeader from "@/components/TabHeader";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 96,
    backgroundColor: colors.crest,
  },
});

const Ayah = () => {
  const router = useRouter();

  const handleFileProcess = async (file: {
    uri: string;
    name: string;
    type: string;
  }) => {
    try {
      console.log("Received file for Ayah prediction:", file);
      router.push({
        pathname: "/(modals)/AyahPrediction",
        params: { file: JSON.stringify(file) },
      });
    } catch (error: any) {
      console.error("Error processing file for Ayah screen:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  return (
    <View style={styles.container}>
      <TabHeader
        title="Identify the Ayah"
        subtitle="Record the recitation to identify which ayah is being recited"
      />
      <Recorder
        onRecordingComplete={handleFileProcess}
        maxDurationSeconds={10}
      />
    </View>
  );
};

export default Ayah;
