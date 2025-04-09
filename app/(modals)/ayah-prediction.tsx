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
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import TajweedVerse from "rn-tajweed-verse";
import Basmala from "@/components/Basmala";

type AyahPredictionRouteProp = RouteProp<
  { AyahPrediction: { file: string } },
  "AyahPrediction"
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
  resultContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  resultText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.black,
    textAlign: "center",
    marginBottom: 8,
  },
  arabicText: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: colors.green,
    textAlign: "center",
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 24,
  },
  surahTitleContainer: {
    width: "100%",
    paddingVertical: 12,
    marginBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  surahTitleText: {
    fontSize: 28,
    color: colors.green,
    textAlign: "center",
  },
  ayahText: {
    fontSize: 36,
    fontFamily: "Poppins_700Bold",
    color: colors.green,
    textAlign: "center",
    writingDirection: "rtl",
  },
  ayahNumberText: {
    fontSize: 20,
    fontFamily: "Poppins_500Medium",
    color: colors.grey,
  },
  ayahContainer: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.greenLight,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.green,
    position: "relative",
  },
  decorativeBorder: {
    position: "absolute",
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderWidth: 2,
    borderColor: colors.green,
    borderRadius: 12,
    opacity: 0.3,
  },
  ayahFrame: {
    fontFamily: "Amiri_400Regular",
    fontSize: 14,
    marginTop: -8,
    color: colors.black,
  },
  surahName: {
    fontFamily: "Amiri_400Regular",
    fontSize: 14,
    marginTop: -8,
    color: colors.black,
  },
});

interface AyahResult {
  surah: string;
  ayahNumber: number;
  arabicText: string;
}

const arabicNumbers = {
  "0": "٠",
  "1": "١",
  "2": "٢",
  "3": "٣",
  "4": "٤",
  "5": "٥",
  "6": "٦",
  "7": "٧",
  "8": "٨",
  "9": "٩",
};

const toArabicNumber = (num: number): string => {
  return num
    .toString()
    .split("")
    .map((digit) => arabicNumbers[digit as keyof typeof arabicNumbers])
    .join("");
};

export default function AyahPrediction() {
  const router = useRouter();
  const route = useRoute<AyahPredictionRouteProp>();
  const fileParam = route.params?.file;
  const [isLoading, setIsLoading] = useState(true);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [ayahResult, setAyahResult] = useState<AyahResult | null>(null);

  useEffect(() => {
    const simulateFetch = async () => {
      setIsLoading(true);
      setAyahResult(null);
      setPredictionError(null);

      try {
        if (fileParam) {
          const file = JSON.parse(fileParam);
          console.log("Simulating Ayah prediction for:", file);
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockResponse: AyahResult = {
          surah: "Al-Baqarah",
          ayahNumber: 255,
          arabicText:
            "\u0671\u0644\u0644\u0651\u064e\u0647\u064f \u0644\u064e\u0627\u06e4 \u0625\u0650\u0644\u064e\u0640\u0670\u0647\u064e \u0625\u0650\u0644\u0651\u064e\u0627 \u0647\u064f\u0648\u064e \u0671\u0644\u06e1\u062d\u064e\u06cc\u0651\u064f \u0671\u0644\u06e1\u0642\u064e\u06cc\u0651\u064f\u0648\u0645\u064f\u06da \u0644\u064e\u0627 \u062a\u064e\u0623\u06e1\u062e\u064f\u0630\u064f\u0647\u064f\u06e5 \u0633\u0650\u0646\u064e\u0629\u08f1 \u0648\u064e\u0644\u064e\u0627 \u0646\u064e\u0648\u06e1\u0645\u08f1\u06da \u0644\u0651\u064e\u0647\u064f\u06e5 \u0645\u064e\u0627 \u0641\u0650\u06cc \u0671\u0644\u0633\u0651\u064e\u0645\u064e\u0640\u0670\u0648\u064e\u200a\u0670\u2060\u062a\u0650 \u0648\u064e\u0645\u064e\u0627 \u0641\u0650\u06cc \u0671\u0644\u06e1\u0623\u064e\u0631\u06e1\u0636\u0650\u06d7 \u0645\u064e\u0646 \u0630\u064e\u0627 \u0671\u0644\u0651\u064e\u0630\u0650\u06cc \u06cc\u064e\u0634\u06e1\u0641\u064e\u0639\u064f \u0639\u0650\u0646\u062d\u064e\u0647\u064f\u06e5\u06e4 \u0625\u0650\u0644\u0651\u064e\u0627 \u0628\u0650\u0625\u0650\u0630\u06e1\u0646\u0650\u0647\u0650\u06e6\u06da \u06cc\u064e\u0639\u06e1\u0644\u064e\u0645\u064f \u0645\u064e\u0627 \u0628\u064e\u06cc\u06e1\u0646\u064e \u0623\u064e\u06cc\u06e1\u062f\u0650\u06cc\u0647\u0650\u0645\u06e1 \u0648\u064e\u0645\u064e\u0627 \u062e\u064e\u0644\u06e1\u0641\u064e\u0647\u064f\u0645\u06e1\u06d6 \u0648\u064e\u0644\u064e\u0627 \u06cc\u064f\u062d\u0650\u06cc\u0637\u064f\u0648\u0646\u064e \u0628\u0650\u0634\u064e\u06cc\u06e1\u0621\u08f2 \u0645\u0651\u0650\u0646\u06e1 \u0639\u0650\u0644\u06e1\u0645\u0650\u0647\u0650\u06e6\u06e4 \u0625\u0650\u0644\u0651\u064e\u0627 \u0628\u0650\u0645\u064e\u0627 \u0634\u064e\u0627\u06e4\u0621\u064e\u06da \u0648\u064e\u0633\u0650\u0639\u064e \u0643\u064f\u0631\u06e1\u0633\u0650\u06cc\u0651\u064f\u0647\u064f \u0671\u0644\u0633\u0651\u064e\u0645\u064e\u0640\u0670\u0648\u064e\u200a\u0670\u2060\u062a\u0650 \u0648\u064e\u0671\u0644\u06e1\u0623\u064e\u0631\u06e1\u0636\u064e\u06d6 \u0648\u064e\u0644\u064e\u0627 \u06cc\u064e\u0640\u0654\u064f\u0648\u062f\u064f\u0647\u064f\u06e5 \u062d\u0650\u0641\u06e1\u0638\u064f\u0647\u064f\u0645\u064e\u0627\u06da \u0648\u064e\u0647\u064f\u0648\u064e \u0671\u0644\u06e1\u0639\u064e\u0644\u0650\u06cc\u0651\u064f \u0671\u0644\u06e1\u0639\u064e\u0638\u0650\u06cc\u0645\u064f\n",
        };

        console.log(
          "Simulated successful Ayah Prediction with Tajweed:",
          mockResponse
        );

        setAyahResult(mockResponse);
      } catch (error) {
        console.error(
          "Error during simulation setup (e.g., JSON parsing):",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    simulateFetch();
  }, [fileParam]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={styles.loadingText}>Identifying Ayah...</Text>
      </View>
    );
  }

  if (predictionError) {
    return (
      <View style={styles.unknownContainer}>
        <Ionicons name="alert-circle-outline" size={60} color={colors.red} />
        <Text style={styles.unknownTitle}>Error</Text>
        <Text style={styles.unknownDescription}>{predictionError}</Text>
        <TouchableOpacity
          style={styles.tryAgainButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.white} />
          <Text style={styles.tryAgainText}>Go Back</Text>
        </TouchableOpacity>
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
              <Text style={styles.headerTitle}>Ayah Identified</Text>
            </View>
          ),
        }}
      />
      {ayahResult ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.successContainer}>
            <Basmala />
            <TajweedVerse
              verse={ayahResult.arabicText}
              config={{
                style: {
                  fontSize: 24,
                  color: colors.black,
                  fontFamily: "Amiri_400Regular",
                  textAlign: "center",
                  lineHeight: 55,
                  writingDirection: "rtl",
                },
              }}
            />
            <View style={styles.ayahContainer}>
              <View style={styles.decorativeBorder} />
              <Text style={styles.surahName}>البقرة</Text>
              <Text style={styles.ayahFrame}>
                {"\uFD3E"}
                {toArabicNumber(ayahResult.ayahNumber)}
                {"\uFD3F"}
              </Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.unknownContainer}>
          <View style={styles.unknownIcon}>
            <Ionicons name="book-outline" size={60} color={colors.green} />
          </View>
          <Text style={styles.unknownTitle}>Ayah Not Recognized</Text>
          <Text style={styles.unknownDescription}>
            We couldn't identify the Ayah with confidence. The audio might be
            unclear, too short, or the specific recitation style might differ.
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
