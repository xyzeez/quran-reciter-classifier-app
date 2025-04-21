import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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
import { ErrorScreen } from "@/components/ErrorScreen";
import { EmptyStateScreen } from "@/components/EmptyStateScreen";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ModalHeader } from "@/components/ModalHeader";
import { SectionListHeader } from "@/components/SectionListHeader";

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
  reciterList: {
    gap: 12,
  },
  footer: {
    height: 16,
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
        <ModalHeader
          title="Reciter Prediction"
          onBackPress={() => router.back()}
        />
        <LoadingScreen message="Analyzing audio..." />
      </View>
    );
  }

  if (prediction?.errorTitle) {
    return (
      <View style={styles.container}>
        <ModalHeader
          title="Reciter Prediction"
          onBackPress={() => router.back()}
        />
        <ErrorScreen
          title={prediction.errorTitle}
          subtitle={prediction.errorSubtitle}
          description="Please check your internet connection and try again. If the problem persists, the server might be experiencing issues."
          iconName={prediction.errorIcon || "alert-circle-outline"}
          onButtonPress={() => router.back()}
        />
      </View>
    );
  }

  if (!prediction?.reliable) {
    return (
      <View style={styles.container}>
        <ModalHeader
          title="Reciter Prediction"
          onBackPress={() => router.back()}
        />
        <EmptyStateScreen
          title="Reciter Not Identified"
          description="We couldn't identify the reciter with confidence. The audio might be unclear or the reciter may not be in our database."
          iconName="person-outline"
          onButtonPress={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ModalHeader
        title="Reciter Prediction"
        onBackPress={() => router.back()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {prediction?.mainPrediction && (
          <ReciterPredicted reciter={prediction.mainPrediction} />
        )}
        <SectionListHeader
          title="Top Predictions"
          count={prediction?.topPredictions?.length}
        />
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
