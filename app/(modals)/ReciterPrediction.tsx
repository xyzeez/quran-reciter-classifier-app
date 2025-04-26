import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import colors from "@/constants/colors";
import PredictedReciter from "@/components/PredictedReciter";
import { Reciter } from "@/types/reciter";
import ReciterPredictionItem from "@/components/ReciterPredictionItem";
import { useEffect, useState } from "react";
import reciterService from "@/services/reciterService";
import { useRoute } from "@react-navigation/native";
import ErrorScreen from "@/components/ErrorScreen";
import EmptyStateScreen from "@/components/EmptyStateScreen";
import LoadingScreen from "@/components/LoadingScreen";
import SectionListHeader from "@/components/SectionListHeader";
import NavigationTab from "@/components/NavigationTab";
import { ReciterPredictionRouteProp } from "@/types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.crest,
    paddingHorizontal: 16,
  },
  scrollContent: {
    gap: 12,
  },
  reciterList: {
    gap: 12,
  },
  footer: {
    height: 16,
  },
});

const ReciterPrediction = () => {
  const router = useRouter();
  const route = useRoute<ReciterPredictionRouteProp>();
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
      <SafeAreaView style={styles.container}>
        <NavigationTab title="Reciter Prediction" />
        <LoadingScreen message="Analyzing audio..." />
      </SafeAreaView>
    );
  }

  if (prediction?.errorTitle) {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationTab title="Reciter Prediction" />
        <ErrorScreen
          title={prediction.errorTitle}
          subtitle={prediction.errorSubtitle}
          description="Please check your internet connection and try again. If the problem persists, the server might be experiencing issues."
          iconName={prediction.errorIcon || "alert-circle-outline"}
          onButtonPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  if (!prediction?.reliable) {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationTab title="Reciter Prediction" />
        <EmptyStateScreen
          title="Reciter Not Identified"
          description="We couldn't identify the reciter with confidence. The audio might be unclear or the reciter may not be in our database."
          iconName="person-outline"
          onButtonPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationTab title="Reciter Prediction" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {prediction?.mainPrediction && (
          <PredictedReciter reciter={prediction.mainPrediction} />
        )}
        <SectionListHeader
          title="Top Predictions"
          count={prediction?.topPredictions?.length}
        />
        <View style={styles.reciterList}>
          {prediction?.topPredictions?.map((reciter, index) => (
            <ReciterPredictionItem key={index} {...reciter} />
          ))}
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReciterPrediction;
