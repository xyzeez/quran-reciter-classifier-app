import { View, ScrollView, StyleSheet } from "react-native";
import colors from "@/constants/colors";
import NavigationTab from "@/components/NavigationTab";
import SectionListHeader from "@/components/SectionListHeader";
import SurahTitleDisplay from "@/components/SurahTitleDisplay";
import QuranVerseDisplay from "@/components/QuranVerseDisplay";
import SurahListItem from "@/components/SurahListItem";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import ayahService from "@/services/ayahService";
import ErrorScreen from "@/components/ErrorScreen";
import EmptyStateScreen from "@/components/EmptyStateScreen";
import LoadingScreen from "@/components/LoadingScreen";
import { AyahPredictionRouteProp } from "@/types/navigation";

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
    paddingBottom: 16,
  },
  contentContainer: {
    gap: 20,
    flexGrow: 1,
  },
  listContainer: {
    gap: 12,
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
        <NavigationTab title="Ayah Identified" />
        <LoadingScreen message="Identifying Ayah..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <NavigationTab title="Ayah Identified" />
        <ErrorScreen
          title={error.title}
          description={error.description}
          iconName={error.icon}
          onButtonPress={() => router.back()}
        />
      </View>
    );
  }

  if (!isFound) {
    return (
      <View style={styles.container}>
        <NavigationTab title="Ayah Identified" />
        <EmptyStateScreen
          title="Ayah Not Identified"
          description="We couldn't identify the ayah with confidence. The audio might be unclear or the recitation may not match our database."
          iconName="book-outline"
          onButtonPress={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationTab title="Ayah Identified" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <SurahTitleDisplay
            surahNumberArabic={matchedAyah.surahNumber.toString()}
            surahNumberEnglish={matchedAyah.surahNumber.toString()}
            surahNameArabic={matchedAyah.surahName.arabic}
          />
          <QuranVerseDisplay
            text={matchedAyah.text}
            ayahNumber={matchedAyah.ayahNumber.arabic}
          />

          <SectionListHeader
            title="Matching Ayahs"
            count={similarAyahs.length}
          />
          <View style={styles.listContainer}>
            {similarAyahs.map((ayah, index) => (
              <SurahListItem
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
