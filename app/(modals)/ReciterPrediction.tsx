import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import colors from "@/constants/colors";
import PredictedReciter from "@/components/PredictedReciter";
import { Reciter } from "@/types/reciter";
import ReciterPredictionItem from "@/components/ReciterPredictionItem";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import reciterService from "@/services/reciterService";
import ayahService from "@/services/ayahService";
import { useRoute } from "@react-navigation/native";
import ErrorScreen from "@/components/ErrorScreen";
import EmptyStateScreen from "@/components/EmptyStateScreen";
import LoadingScreen from "@/components/LoadingScreen";
import SectionListHeader from "@/components/SectionListHeader";
import NavigationTab from "@/components/NavigationTab";
import { ReciterPredictionRouteProp } from "@/types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SurahAyahData } from "@/types/ayah";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import ReciterAudioPlayer from "@/components/ReciterAudioPlayer";

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
  bottomSheetContainer: {
    flex: 1,
  },
});

const ReciterPrediction = () => {
  const router = useRouter();
  const route = useRoute<ReciterPredictionRouteProp>();
  const fileParam = route.params?.file;
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [surahAyahData, setSurahAyahData] = useState<SurahAyahData | null>(
    null
  );
  const [isLoadingAyah, setIsLoadingAyah] = useState(false);
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

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) {
      // Reset selected reciter when sheet is closed
      setSelectedReciter(null);
    }
  }, []);

  const fetchAyahData = useCallback(async () => {
    if (isLoadingAyah || surahAyahData || !fileParam) return;

    setIsLoadingAyah(true);
    try {
      const file = JSON.parse(fileParam);
      const response = await ayahService.predictAyah(file);

      if (response.reliable && response.matchedAyah) {
        console.log("Ayah Data Response:", response);
        setSurahAyahData({
          surah_number_en: response.matchedAyah.surah_number_en,
          ayah_number_en: response.matchedAyah.ayah_number_en,
          surah_name_en: response.matchedAyah.surah_name_en,
          surah_name: response.matchedAyah.surah_name,
          ayah_number: response.matchedAyah.ayah_number,
        });
      }
    } catch (error) {
      console.error("Error fetching ayah data:", error);
    } finally {
      setIsLoadingAyah(false);
    }
  }, [fileParam, isLoadingAyah, surahAyahData]);

  const handleSnapPress = useCallback((reciter: Reciter) => {
    setSelectedReciter(reciter);
    sheetRef.current?.snapToIndex(0);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  useEffect(() => {
    const fetchPredictions = async () => {
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
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <NavigationTab title="Reciter Prediction" />
        <LoadingScreen message="Analyzing audio..." />
      </SafeAreaView>
    );
  }

  if (prediction?.errorTitle) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
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
      <SafeAreaView style={styles.container} edges={["bottom"]}>
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
    <GestureHandlerRootView style={styles.bottomSheetContainer}>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <NavigationTab title="Reciter Prediction" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {prediction?.mainPrediction && (
            <PredictedReciter
              reciter={prediction.mainPrediction}
              listenHandler={() => handleSnapPress(prediction.mainPrediction!)}
            />
          )}
          <SectionListHeader
            title="Top Predictions"
            count={prediction?.topPredictions?.length}
          />
          <View style={styles.reciterList}>
            {prediction?.topPredictions?.map((reciter, index) => (
              <ReciterPredictionItem
                key={index}
                {...reciter}
                onPress={() => handleSnapPress(reciter)}
              />
            ))}
          </View>
          <View style={styles.footer} />
        </ScrollView>
        <BottomSheet
          ref={sheetRef}
          onChange={handleSheetChange}
          backdropComponent={renderBackdrop}
          snapPoints={snapPoints}
          index={-1}
          enablePanDownToClose={true}
          handleIndicatorStyle={{
            backgroundColor: colors.green,
            width: 40,
            height: 4,
          }}
        >
          <BottomSheetView>
            {selectedReciter && (
              <ReciterAudioPlayer
                reciter={selectedReciter}
                surahAyahData={surahAyahData}
                onNeedAyahData={fetchAyahData}
                isLoadingAyah={isLoadingAyah}
              />
            )}
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ReciterPrediction;
