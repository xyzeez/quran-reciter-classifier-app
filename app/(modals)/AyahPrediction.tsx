import { View, ScrollView, StyleSheet } from "react-native";
import colors from "@/constants/colors";
import NavigationTab from "@/components/NavigationTab";
import SectionListHeader from "@/components/SectionListHeader";
import QuranVerseDisplay from "@/components/QuranVerseDisplay";
import SurahListItem from "@/components/SurahListItem";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import ayahService from "@/services/ayahService";
import ErrorScreen from "@/components/ErrorScreen";
import EmptyStateScreen from "@/components/EmptyStateScreen";
import LoadingScreen from "@/components/LoadingScreen";
import { AyahPredictionRouteProp } from "@/types/navigation";
import { Ayah } from "@/types/ayah"; // Use Ayah type
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [displayedAyah, setDisplayedAyah] = useState<Ayah | null>(null); // Use Ayah type
  const [similarAyahs, setSimilarAyahs] = useState<Ayah[]>([]); // Use Ayah type
  const [error, setError] = useState<{
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
  } | null>(null);
  const scrollViewRef = useRef<ScrollView>(null); // Create a ref for the ScrollView

  useEffect(() => {
    const fetchAyahPrediction = async () => {
      setIsLoading(true);
      setError(null);
      setDisplayedAyah(null); // Reset states
      setSimilarAyahs([]);

      try {
        if (fileParam) {
          const file = JSON.parse(fileParam);
          console.log("Received file for ayah prediction:", file);

          const result = await ayahService.predictAyah(file);
          const apiMatchedAyah = result.matchedAyah as Ayah | null;
          const apiSimilarAyahs = (result.similarAyahs || []) as Ayah[];

          let finalSimilarAyahs = apiSimilarAyahs;

          if (apiMatchedAyah && result.reliable) {
            setDisplayedAyah(apiMatchedAyah);
            finalSimilarAyahs = [
              apiMatchedAyah,
              ...apiSimilarAyahs.filter(
                (ayah) =>
                  ayah.surah_number_en !== apiMatchedAyah.surah_number_en ||
                  ayah.ayah_number_en !== apiMatchedAyah.ayah_number_en
              ),
            ];
          } else if (apiSimilarAyahs.length > 0) {
            setDisplayedAyah(apiSimilarAyahs[0]);
          } else {
            setDisplayedAyah(null);
          }
          setSimilarAyahs(finalSimilarAyahs);
        } else {
          setError({
            title: "Missing File",
            description: "No audio file data was provided to identify.",
            icon: "alert-circle-outline",
          });
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

  const handleAyahSelect = (ayah: Ayah) => {
    // Use Ayah type
    setDisplayedAyah(ayah);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationTab title="Ayah Identified" />
        <LoadingScreen message="Identifying Ayah..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationTab title="Ayah Identified" />
        <ErrorScreen
          title={error.title}
          description={error.description}
          iconName={error.icon}
          buttonText="Go Back"
          onButtonPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  // Show empty state only if no ayah is available to display
  if (!displayedAyah) {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationTab title="Ayah Identified" />
        <EmptyStateScreen
          title="Ayah Not Found"
          description="We couldn't identify any matching ayah from the provided audio. Please try recording again clearly."
          iconName="sad-outline"
          buttonText="Go Back"
          onButtonPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  // Render the main content if an ayah (matched or similar) is available
  return (
    <SafeAreaView style={styles.container}>
      <NavigationTab title="Ayah Identified" />
      <ScrollView
        ref={scrollViewRef} // Assign the ref to the ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Display the currently selected Ayah */}
          <QuranVerseDisplay
            key={`${displayedAyah.surah_number_en}-${displayedAyah.ayah_number_en}`}
            ayah_text={displayedAyah.ayah_text}
            ayah_number={displayedAyah.ayah_number} // Expects string
            surah_name_en={displayedAyah.surah_name_en}
            surah_number={displayedAyah.surah_number} // Expects string
            surah_number_en={displayedAyah.surah_number_en} // Expects string or number
            unicode={displayedAyah.unicode || ""} // Pass unicode
            isSingleResult={similarAyahs.length <= 1}
            scrollViewRef={scrollViewRef}
          />

          {/* Show similar ayahs list only if there are multiple results */}
          {similarAyahs.length > 1 && (
            <>
              <SectionListHeader
                title="Matching Ayahs"
                count={similarAyahs.length}
              />
              <View style={styles.listContainer}>
                {similarAyahs.map((ayah, index) => {
                  // Determine if the current item is the one being displayed
                  const isActive =
                    displayedAyah?.surah_number_en === ayah.surah_number_en && // Use number for comparison
                    displayedAyah?.ayah_number_en === ayah.ayah_number_en;
                  return (
                    <SurahListItem
                      key={`${ayah.surah_number_en}-${ayah.ayah_number_en}-${index}`}
                      active={isActive}
                      surah_name={ayah.surah_name}
                      surah_name_en={ayah.surah_name_en}
                      surah_number={ayah.surah_number}
                      surah_number_en={ayah.surah_number_en}
                      ayah_number={ayah.ayah_number}
                      onPress={() => handleAyahSelect(ayah)}
                    />
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AyahPrediction;
