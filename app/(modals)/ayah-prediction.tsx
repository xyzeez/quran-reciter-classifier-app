import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { colors } from "@/constants/colors";
import { Tab } from "@/components/Tab";
import { ListTitle } from "@/components/ListTitle";
import { SurahName } from "@/components/SurahName";
import { SurahContent } from "@/components/SurahContent";
import { SurahItem } from "@/components/SurahItem";
import { useState, useEffect } from "react";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ayahService } from "@/services/ayahService";

// Define a type for the route params
type AyahPredictionRouteProp = RouteProp<
  { "ayah-prediction": { file: string } },
  "ayah-prediction"
>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.crest,
    paddingHorizontal: 16,
    height: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    gap: 24,
    paddingBottom: 92,
  },
  contentContainer: {
    gap: 20,
    flexGrow: 1,
  },
  listContainer: {
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontFamily: "Poppins_400Regular",
    color: colors.green,
    fontSize: 16,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  notFoundIcon: {
    width: 120,
    height: 120,
    backgroundColor: colors.white,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  notFoundTitle: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: colors.green,
    textAlign: "center",
    marginBottom: 12,
  },
  notFoundDescription: {
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
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorIcon: {
    width: 120,
    height: 120,
    backgroundColor: colors.white,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: colors.red,
    textAlign: "center",
    marginBottom: 12,
  },
  errorDescription: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
    textAlign: "center",
    lineHeight: 24,
  },
});

const AyahPrediction = () => {
  const router = useRouter();
  const route = useRoute<AyahPredictionRouteProp>();
  const fileParam = route.params?.file;
  const [isLoading, setIsLoading] = useState(true);
  const [isFound, setIsFound] = useState(false);
  const [matchedAyah, setMatchedAyah] = useState<any>(null);
  const [similarAyahs, setSimilarAyahs] = useState<any[]>([]);
  const [error, setError] = useState<{
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
  } | null>(null);

  useEffect(() => {
    const fetchAyahPrediction = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (fileParam) {
          const file = JSON.parse(fileParam);
          console.log("Received file for ayah prediction:", file);

          const result = await ayahService.predictAyah(file);

          if (result.reliable && result.matchedAyah) {
            setIsFound(true);
            setMatchedAyah(result.matchedAyah);
            setSimilarAyahs(result.similarAyahs || []);
          } else {
            setIsFound(false);
            setSimilarAyahs(result.similarAyahs || []);
          }
        }
      } catch (error: any) {
        console.error("Error processing ayah prediction:", error);
        setError({
          title: "Connection Error",
          description:
            "We couldn't connect to our servers. Please check your internet connection and try again.",
          icon: "wifi-outline",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAyahPrediction();
  }, [fileParam]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Tab title="Ayah Identified" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.loadingText}>Identifying Ayah...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Tab title="Ayah Identified" />
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <Ionicons name={error.icon} size={60} color={colors.red} />
          </View>
          <Text style={styles.errorTitle}>{error.title}</Text>
          <Text style={styles.errorDescription}>{error.description}</Text>
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

  if (!isFound) {
    return (
      <View style={styles.container}>
        <Tab title="Ayah Identified" />
        <View style={styles.notFoundContainer}>
          <View style={styles.notFoundIcon}>
            <Ionicons name="book-outline" size={60} color={colors.green} />
          </View>
          <Text style={styles.notFoundTitle}>Ayah Not Identified</Text>
          <Text style={styles.notFoundDescription}>
            We couldn't identify the ayah with confidence. The audio might be
            unclear or the recitation may not match our database.
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
      <Tab title="Ayah Identified" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <SurahName
            surahNumberArabic={matchedAyah.surahNumber.toString()}
            surahNumberEnglish={matchedAyah.surahNumber.toString()}
            surahNameArabic={matchedAyah.surahName.arabic}
          />
          <SurahContent
            text={matchedAyah.text}
            ayahNumber={matchedAyah.ayahNumber.arabic}
          />

          <ListTitle title="Matching Ayahs" count={similarAyahs.length} />
          <View style={styles.listContainer}>
            {similarAyahs.map((ayah, index) => (
              <SurahItem
                key={index}
                surahNameArabic={ayah.surahName.arabic}
                surahNameEnglish={ayah.surahName.english}
                ayahNumberArabic={ayah.ayahNumber.arabic}
                ayahNumberEnglish={ayah.ayahNumber.english}
                text={ayah.text}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AyahPrediction;
