import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import ReciterPredicted from "@/components/ReciterPredicted";
import recitersData from "@/constants/reciters.json";
import { Reciter } from "@/types/reciter";
import TopPrediction from "@/components/TopPrediction";
import { useEffect, useState } from "react";
import { reciterService } from "@/services/reciterService";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

// Demo data
const mainPrediction: Reciter = recitersData.reciters[0];

const topPredictions: Reciter[] = recitersData.reciters.slice(1, 6);

// Define a type for the route params
type PredictionRouteProp = RouteProp<
  { Prediction: { file: string } },
  "Prediction"
>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.crest,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.crest,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: colors.green,
  },
  sectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: colors.greyLight,
    marginHorizontal: 12,
  },
  reciterList: {
    gap: 12,
  },
  footer: {
    height: 16,
  },
  unknownContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  unknownIcon: {
    width: 120,
    height: 120,
    backgroundColor: colors.white,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  unknownTitle: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: colors.green,
    textAlign: "center",
    marginBottom: 12,
  },
  unknownDescription: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
    textAlign: "center",
    lineHeight: 24,
  },
  tryAgainButton: {
    backgroundColor: colors.green,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tryAgainText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.crest,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
  },
});

export default function PredictionResults() {
  const router = useRouter();
  const route = useRoute<PredictionRouteProp>();
  const fileParam = route.params?.file;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndLogPredictions = async () => {
      try {
        if (fileParam) {
          const file = JSON.parse(fileParam);
          console.log("Received file for prediction:", file);

          const response = await reciterService.predictReciter(file);
          console.log("Prediction response:", response);
        }
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndLogPredictions();
  }, [fileParam]);

  const known = true;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={styles.loadingText}>Identifying Reciter...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={colors.green} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Prediction Results</Text>
            </View>
          ),
        }}
      />
      {known ? (
        <ScrollView>
          <ReciterPredicted reciter={mainPrediction} />
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Top 5 Predictions</Text>
            <View style={styles.separator} />
          </View>
          <View style={styles.reciterList}>
            {topPredictions.map((reciter) => (
              <TopPrediction key={reciter.id} {...reciter} />
            ))}
          </View>
          <View style={styles.footer}></View>
        </ScrollView>
      ) : (
        <View style={styles.unknownContainer}>
          <View style={styles.unknownIcon}>
            <Ionicons name="person-outline" size={60} color={colors.green} />
          </View>
          <Text style={styles.unknownTitle}>Reciter Not Recognized</Text>
          <Text style={styles.unknownDescription}>
            We couldn't identify the reciter with confidence. The audio might be
            too short, or the reciter may not be in our database yet.
          </Text>
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={() => router.back()}
          >
            <Ionicons name="refresh" size={20} color={colors.white} />
            <Text style={styles.tryAgainText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
