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
import { QuranVerseDisplayProps } from "@/types/ui"; // Import props type

// Define a type for the Ayah data structure
// Assuming 'encode' is optional or always present as needed by QuranVerseDisplay
type AyahData = Omit<QuranVerseDisplayProps, "encode"> & {
  surah_name: string;
  encode?: string; // Make encode optional if it might be missing from similarAyahs
};

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
  // const [isFound, setIsFound] = useState(false); // We might not need this state anymore
  // const [matchedAyah, setMatchedAyah] = useState<AyahData | null>(null); // Store original match if needed
  const [displayedAyah, setDisplayedAyah] = useState<AyahData | null>(null); // Ayah currently shown
  const [similarAyahs, setSimilarAyahs] = useState<AyahData[]>([]); // List of similar ayahs
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
      // setMatchedAyah(null);

      try {
        if (fileParam) {
          const file = JSON.parse(fileParam);
          console.log("Received file for ayah prediction:", file);

          const result = await ayahService.predictAyah(file);
          const apiMatchedAyah = result.matchedAyah as AyahData | null;
          const apiSimilarAyahs = (result.similarAyahs || []) as AyahData[];

          // setMatchedAyah(apiMatchedAyah); // Store if needed elsewhere
          let finalSimilarAyahs = apiSimilarAyahs;

          if (apiMatchedAyah && result.reliable) {
            // setIsFound(true);
            setDisplayedAyah(apiMatchedAyah); // Display confident match
            // Ensure the matched Ayah is the first item in the list for rendering
            finalSimilarAyahs = [
              apiMatchedAyah,
              ...apiSimilarAyahs.filter(
                (ayah) =>
                  ayah.surah_number !== apiMatchedAyah.surah_number ||
                  ayah.ayah_number !== apiMatchedAyah.ayah_number
              ),
            ];
          } else if (apiSimilarAyahs.length > 0) {
            // setIsFound(false);
            setDisplayedAyah(apiSimilarAyahs[0]); // Display first similar if no confident match
          } else {
            // setIsFound(false);
            setDisplayedAyah(null); // No match, no similar ayahs
          }

          setSimilarAyahs(finalSimilarAyahs); // Set the final list including the matched ayah if necessary
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

  const handleAyahSelect = (ayah: AyahData) => {
    setDisplayedAyah(ayah);
    // Scroll to top when a new ayah is selected
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

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
          buttonText="Go Back"
          onButtonPress={() => router.back()}
        />
      </View>
    );
  }

  // Show empty state only if no ayah is available to display
  if (!displayedAyah) {
    return (
      <View style={styles.container}>
        <NavigationTab title="Ayah Identified" />
        <EmptyStateScreen
          title="Ayah Not Found"
          description="We couldn't identify any matching ayah from the provided audio. Please try recording again clearly."
          iconName="sad-outline"
          buttonText="Go Back"
          onButtonPress={() => router.back()}
        />
      </View>
    );
  }

  // Render the main content if an ayah (matched or similar) is available
  return (
    <View style={styles.container}>
      <NavigationTab title="Ayah Identified" />
      <ScrollView
        ref={scrollViewRef} // Assign the ref to the ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Display the currently selected Ayah */}
          <QuranVerseDisplay
            surah_number={displayedAyah.surah_number}
            surah_number_en={displayedAyah.surah_number_en}
            encode={displayedAyah.encode || ""} // Provide default for encode if optional
            ayah_text={displayedAyah.ayah_text}
            ayah_number={displayedAyah.ayah_number} // Ensure QuranVerseDisplay handles this
            surah_name_en={displayedAyah.surah_name_en}
            isSingleResult={similarAyahs.length <= 1} // Pass the flag
            scrollViewRef={scrollViewRef} // Pass the ref down
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
                    displayedAyah?.surah_number === ayah.surah_number &&
                    displayedAyah?.ayah_number === ayah.ayah_number;
                  return (
                    <SurahListItem
                      key={`${ayah.surah_number}-${ayah.ayah_number}-${index}`} // More specific key
                      active={isActive}
                      surah_name={ayah.surah_name}
                      surah_name_en={ayah.surah_name_en}
                      surah_number={ayah.surah_number}
                      surah_number_en={ayah.surah_number_en}
                      ayah_number={ayah.ayah_number} // Pass ayah_number
                      ayah_text={ayah.ayah_text}
                      onPress={() => handleAyahSelect(ayah)} // Set this item as displayed on press
                    />
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AyahPrediction;
