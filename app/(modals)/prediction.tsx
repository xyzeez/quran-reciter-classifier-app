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
import { Reciter } from "@/types/reciter";
import TopPrediction from "@/components/TopPrediction";
import { useEffect, useState } from "react";
import { reciterService } from "@/services/reciterService";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

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
    paddingHorizontal: 0,
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
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: colors.red,
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: colors.grey,
    textAlign: "center",
    marginBottom: 16,
  },
  errorDescription: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 24,
  },
});

export default function PredictionResults() {
  const router = useRouter();
  const route = useRoute<PredictionRouteProp>();
  const fileParam = route.params?.file;
  const [isLoading, setIsLoading] = useState(true);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{
    reliable: boolean;
    mainPrediction?: Reciter;
    topPredictions?: Reciter[];
    errorTitle?: string;
    errorSubtitle?: string;
    errorIcon?:
      | "alert-circle-outline"
      | "musical-notes-outline"
      | "time-outline"
      | "wifi-outline"
      | "globe-outline";
    errorColor?: string;
  } | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      setPredictionError(null);
      setIsLoading(true);
      try {
        if (fileParam) {
          const file = JSON.parse(fileParam);
          console.log("Received file for prediction:", file);

          const response = await reciterService.predictReciter(file);
          console.log("Prediction response:", {
            reliable: response.reliable,
            mainPrediction: response.main_prediction,
            topPredictions: response.top_predictions,
            rawResponse: response,
          });

          if (response.reliable && response.main_prediction) {
            setPrediction({
              reliable: true,
              mainPrediction: {
                name: response.main_prediction.name,
                confidence: response.main_prediction.confidence,
                nationality: response.main_prediction.nationality,
                flagUrl: response.main_prediction.flagUrl,
                imageUrl: response.main_prediction.imageUrl,
                serverUrl: response.main_prediction.serverUrl,
              },
              topPredictions: response.top_predictions?.map((pred) => ({
                name: pred.name,
                confidence: pred.confidence,
                nationality: pred.nationality,
                flagUrl: pred.flagUrl,
                imageUrl: pred.imageUrl,
                serverUrl: pred.serverUrl,
              })),
            });
          } else {
            setPrediction({
              reliable: false,
              topPredictions: response.top_predictions?.map((pred) => ({
                name: pred.name,
                confidence: pred.confidence,
                nationality: pred.nationality,
                flagUrl: pred.flagUrl,
                imageUrl: pred.imageUrl,
                serverUrl: pred.serverUrl,
              })),
            });
          }
        }
      } catch (error: any) {
        console.error("Error fetching predictions:", error);

        // Set error state
        setPrediction({
          reliable: false,
          errorTitle: "Connection Error",
          errorSubtitle: "We couldn't process your recording",
          errorIcon: "wifi-outline",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [fileParam]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.green} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reciter Prediction</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.loadingText}>Analyzing audio...</Text>
        </View>
      </View>
    );
  }

  if (prediction?.errorTitle) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.green} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reciter Prediction</Text>
        </View>
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons
              name={prediction.errorIcon || "alert-circle-outline"}
              size={40}
              color={colors.red}
            />
          </View>
          <Text style={styles.errorTitle}>{prediction.errorTitle}</Text>
          <Text style={styles.errorSubtitle}>{prediction.errorSubtitle}</Text>
          <Text style={styles.errorDescription}>
            Please check your internet connection and try again. If the problem
            persists, the server might be experiencing issues.
          </Text>
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={() => router.back()}
          >
            <Ionicons name="refresh" size={20} color={colors.white} />
            <Text style={styles.tryAgainText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!prediction?.reliable) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.green} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reciter Prediction</Text>
        </View>
        <View style={styles.unknownContainer}>
          <View style={styles.unknownIcon}>
            <Ionicons name="person-outline" size={60} color={colors.green} />
          </View>
          <Text style={styles.unknownTitle}>Reciter Not Identified</Text>
          <Text style={styles.unknownDescription}>
            We couldn't identify the reciter with confidence. The audio might be
            unclear or the reciter may not be in our database.
          </Text>
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={() => router.back()}
          >
            <Ionicons name="refresh" size={20} color={colors.white} />
            <Text style={styles.tryAgainText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.green} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reciter Prediction</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {prediction?.mainPrediction && (
          <ReciterPredicted reciter={prediction.mainPrediction} />
        )}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            Top {prediction?.topPredictions?.length || 0} Predictions
          </Text>
          <View style={styles.separator} />
        </View>
        <View style={styles.reciterList}>
          {prediction?.topPredictions?.map((reciter, index) => (
            <TopPrediction key={index} {...reciter} />
          ))}
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
