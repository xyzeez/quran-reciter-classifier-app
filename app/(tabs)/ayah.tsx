import colors from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";
import Recorder from "@/components/Recorder";
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
      <Text style={styles.heading}>Identify the Ayah</Text>
      <Text style={styles.text}>
        Record the recitation to identify which ayah is being recited
      </Text>
      <Recorder
        onRecordingComplete={handleFileProcess}
        maxDurationSeconds={10}
      />
    </View>
  );
};

export default Ayah;
