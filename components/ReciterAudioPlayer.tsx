import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import colors from "@/constants/colors";
import ActionButton from "./ActionButton";

// Demo audio data for surah and ayah
const defaultAudioInfo = {
  surahNumber: 10,
  ayahNumber: 10,
  surahName: "Yunus",
};

// Default reciter data for development/fallback
const defaultReciterData = {
  confidence: 99.26,
  flagUrl: "https://flagcdn.com/w40/kw.png",
  imageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Abdul-Rahman_Al-Sudais_%28Cropped%2C_2011%29.jpg/449px-Abdul-Rahman_Al-Sudais_%28Cropped%2C_2011%29.jpg",
  name: "Mishary Alafasi",
  nationality: "Kuwait",
  serverUrl: "https://everyayah.com/data/Alafasy_128kbps/",
};

export interface ReciterAudioPlayerProps {
  reciter?: {
    name: string;
    nationality: string;
    imageUrl: string;
    confidence: number;
    serverUrl?: string;
  };
}

const ReciterAudioPlayer = ({
  reciter = defaultReciterData,
}: ReciterAudioPlayerProps) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [durationMillis, setDurationMillis] = useState<number | null>(null);
  const [positionMillis, setPositionMillis] = useState<number>(0);
  const isSeeking = useRef(false);
  const shouldPlayAfterSeek = useRef(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const { surahNumber, ayahNumber, surahName } = defaultAudioInfo;

  // Construct the audio URL based on reciter's serverUrl
  const getAudioUrl = () => {
    // Use reciter's serverUrl if available, otherwise use default
    const baseUrl = reciter.serverUrl || defaultReciterData.serverUrl;

    // Format surah and ayah numbers with leading zeros
    const formattedSurah = String(surahNumber).padStart(3, "0");
    const formattedAyah = String(ayahNumber).padStart(3, "0");

    // Check if the URL already ends with a slash, if not add one
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

    // Try to fix SSL issues by converting to HTTP if needed
    const secureBaseUrl = normalizedBaseUrl.replace("https://", "http://");

    // Different APIs use different URL structures, try to detect pattern
    let finalUrl;
    if (secureBaseUrl.includes("everyayah.com")) {
      // everyayah.com uses pattern: baseUrl/001001.mp3
      finalUrl = `${secureBaseUrl}${formattedSurah}${formattedAyah}.mp3`;
    } else if (secureBaseUrl.includes("quran.ksu.edu.sa")) {
      // quran.ksu.edu.sa uses pattern: baseUrl/001001.mp3
      finalUrl = `${secureBaseUrl}${formattedSurah}${formattedAyah}.mp3`;
    } else {
      // Generic fallback for other APIs
      finalUrl = `${secureBaseUrl}${formattedSurah}${formattedAyah}.mp3`;
    }

    // Log the final URL for debugging
    console.log("🔊 Loading audio from URL:", finalUrl);
    console.log("🎙️ Reciter:", reciter.name);
    console.log("🔗 Original server URL:", baseUrl);

    return finalUrl;
  };

  // Define a fallback URL if the main one fails
  const getFallbackUrl = () => {
    // Always use a known working source as fallback
    const fallbackBaseUrl = "http://everyayah.com/data/";
    const reciterCode = reciter.name.includes("Alafasi")
      ? "Alafasy_128kbps"
      : reciter.name.includes("Hussar")
        ? "Husary_128kbps"
        : reciter.name.includes("Minshawi")
          ? "Minshawy_Murattal_128kbps"
          : reciter.name.includes("Abdulsamad")
            ? "Abdul_Basit_Murattal_64kbps"
            : reciter.name.includes("Shuraim")
              ? "Saood_ash-Shuraym_64kbps"
              : "Alafasy_128kbps"; // Default to Alafasy if no match

    const formattedSurah = String(surahNumber).padStart(3, "0");
    const formattedAyah = String(ayahNumber).padStart(3, "0");

    return `${fallbackBaseUrl}${reciterCode}/${formattedSurah}${formattedAyah}.mp3`;
  };

  const audioUrl = getAudioUrl();
  const fallbackUrl = getFallbackUrl();

  const formatTime = (millis: number | null): string => {
    if (millis === null) return "--:--";
    const totalSeconds = Math.floor(millis / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    let isMounted = true;

    // Define the playback status update handler
    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
      if (!isMounted) return;

      if (!status.isLoaded) {
        if (status.error) {
          setError(`Unable to play audio`);
          console.error("Playback Error:", status.error);
          setIsLoading(false);
          setIsPlaying(false);
          setIsReady(false);
        }
        return;
      }

      const successStatus = status as AVPlaybackStatusSuccess;

      if (successStatus.isBuffering) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
        setIsReady(true);
      }

      if (!isSeeking.current) {
        setPositionMillis(successStatus.positionMillis);
      }

      setDurationMillis(successStatus.durationMillis ?? null);
      setIsPlaying(successStatus.isPlaying);

      // Handle audio finishing playback more smoothly
      if (successStatus.didJustFinish && !successStatus.isLooping) {
        // Set playing state to false when finished
        setIsPlaying(false);

        // Set position to 0 to show start state in UI
        setPositionMillis(0);

        // Without calling any additional methods on the sound object
        // This prevents the audio from automatically restarting
        console.log("Audio playback completed");
      }

      setError(null);
    };

    const loadAudio = async () => {
      try {
        setIsLoading(true);
        setIsReady(false);
        setError(null);

        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        // First try with the primary URL
        try {
          console.log("Attempting to load primary URL:", audioUrl);
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: audioUrl },
            {
              shouldPlay: false,
              progressUpdateIntervalMillis: 50,
            },
            handlePlaybackStatusUpdate
          );

          if (isMounted) {
            console.log("✅ Primary URL loaded successfully:", audioUrl);
            // Cleanup previous sound instance
            if (soundRef.current) {
              await soundRef.current.stopAsync();
              await soundRef.current.unloadAsync();
            }
            soundRef.current = newSound;
            setSound(newSound);
            setIsReady(true);
            setIsLoading(false);

            // Start playing automatically when loaded
            try {
              await newSound.playAsync();
              setIsPlaying(true);
              console.log("🎵 Auto-play started");
            } catch (playError) {
              console.error("Failed to auto-play:", playError);
              // Continue without auto-play if there's an error
            }
          }
        } catch (primaryError: any) {
          // If primary URL fails, try fallback
          const errorMessage = primaryError?.message || "Unknown error";

          // Check for common error codes
          if (errorMessage.includes("503")) {
            console.warn(
              "⚠️ Primary URL server unavailable (503), trying fallback. This is normal and handled automatically."
            );
          } else {
            console.error("❌ Primary URL error:", primaryError);
          }

          try {
            console.log("🔄 Trying fallback URL:", fallbackUrl);
            const { sound: fallbackSound } = await Audio.Sound.createAsync(
              { uri: fallbackUrl },
              {
                shouldPlay: false,
                progressUpdateIntervalMillis: 50,
              },
              handlePlaybackStatusUpdate
            );

            if (isMounted) {
              console.log("✅ Fallback URL loaded successfully:", fallbackUrl);
              // Cleanup previous sound instance
              if (soundRef.current) {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
              }
              soundRef.current = fallbackSound;
              setSound(fallbackSound);
              setIsReady(true);
              setIsLoading(false);

              // Start playing automatically when loaded
              try {
                await fallbackSound.playAsync();
                setIsPlaying(true);
                console.log("🎵 Auto-play started (fallback)");
              } catch (playError) {
                console.error("Failed to auto-play fallback:", playError);
                // Continue without auto-play if there's an error
              }
            }
          } catch (fallbackError: any) {
            // Both URLs failed
            console.error("❌ Both primary and fallback URLs failed");
            throw new Error(
              `Audio unavailable: ${fallbackError?.message || "Unknown error"}`
            );
          }
        }
      } catch (e: any) {
        console.error("Failed to load sound", e);
        if (isMounted) {
          setError(`We couldn't load this audio. Please try again later.`);
          setIsLoading(false);
          setIsReady(false);
        }
      }
    };

    loadAudio();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.stopAsync().then(() => {
          if (soundRef.current) {
            soundRef.current.unloadAsync();
            soundRef.current = null;
          }
        });
      }
    };
  }, [audioUrl, fallbackUrl]);

  const playPauseAudio = async () => {
    const currentSound = soundRef.current;
    if (!currentSound || !isReady || isLoading) return;

    try {
      if (isPlaying) {
        await currentSound.pauseAsync();
        setIsPlaying(false);
      } else {
        // If near the end, start from beginning
        if (positionMillis >= (durationMillis ?? Infinity) - 100) {
          await currentSound.setPositionAsync(0);
        }
        await currentSound.playAsync();
        setIsPlaying(true);
      }
    } catch (e: any) {
      console.error("Error playing/pausing sound", e);
      setError(
        `There was a problem with the audio playback. Please try again.`
      );
      setIsPlaying(false);
    }
  };

  const onSeekStart = () => {
    isSeeking.current = true;
    shouldPlayAfterSeek.current = isPlaying;
    if (isPlaying) {
      sound?.pauseAsync();
    }
  };

  const onSeekComplete = async (value: number) => {
    if (!sound) return;
    isSeeking.current = false;
    try {
      await sound.setPositionAsync(value);
      setPositionMillis(value);
      if (shouldPlayAfterSeek.current) {
        await sound.playAsync();
      }
    } catch (e) {
      console.error("Error seeking audio:", e);
    }
  };

  // Normalize confidence value (ensure it's between 0-100)
  // API values are already in percentage format, so don't multiply by 100
  const normalizedConfidence =
    reciter.confidence !== undefined
      ? Math.min(100, Math.max(0, reciter.confidence))
      : null; // No default value

  const confidencePercent =
    normalizedConfidence !== null ? Math.floor(normalizedConfidence) : null;

  // Determine color based on confidence level
  const getConfidenceColor = (value: number | null) => {
    if (value === null) return colors.green;
    if (value >= 80) return colors.green;
    if (value >= 60) return "#88A044"; // Lighter green
    if (value >= 40) return "#CCAA36"; // Yellow
    if (value >= 20) return "#E67E22"; // Orange
    return colors.red; // Red for low confidence
  };

  const confidenceColor = getConfidenceColor(normalizedConfidence);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.loadingText}>Loading Audio...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContentContainer}>
          <MaterialIcons name="error-outline" size={40} color={colors.red} />
          <Text style={styles.errorTitle}>Audio Playback Issue</Text>
          <Text style={styles.errorMessage}>
            We couldn't play this recitation. This might be due to a network
            issue or the file may be unavailable.
          </Text>
          <ActionButton
            label="Try Again"
            iconName="refresh"
            onPress={() => {
              setIsLoading(true);
              setError(null);
              setTimeout(() => {
                soundRef.current?.unloadAsync().then(() => {
                  soundRef.current = null;
                  setSound(null);
                });
              }, 500);
            }}
          />
        </View>
      </View>
    );
  }

  // Success state - audio ready to play
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: reciter.imageUrl }} style={styles.reciterImage} />
        {confidencePercent !== null && (
          <View style={styles.confidenceContainer}>
            <View
              style={[
                styles.confidenceCircle,
                { backgroundColor: confidenceColor },
              ]}
            >
              <Text style={styles.confidenceText}>{confidencePercent}%</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.reciterInfoContainer}>
        <Text style={styles.reciterName}>{reciter.name}</Text>
        <View style={styles.surahInfoContainer}>
          <Ionicons name="book-outline" size={16} color={colors.green} />
          <Text style={styles.surahText}>
            {surahName} <Text style={styles.ayahText}>• Ayah {ayahNumber}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.playbackContainer}>
        <Pressable
          style={styles.playButtonContainer}
          onPress={playPauseAudio}
          disabled={!isReady}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color={colors.white}
            />
          )}
        </Pressable>

        <View style={styles.progressContainer}>
          <View style={styles.progressWrap}>
            <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${durationMillis ? (positionMillis / durationMillis) * 100 : 0}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingTop: 32,
    paddingInline: 16,
    paddingBottom: 24,
    alignItems: "center",
    width: "100%",
  },
  loadingContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: colors.grey,
  },
  errorContentContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: colors.red,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
    textAlign: "center",
    marginBottom: 20,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  reciterImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: colors.green + "20",
  },
  confidenceContainer: {
    position: "absolute",
    bottom: -4,
    right: -4,
  },
  confidenceCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.green,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  confidenceText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
  },
  reciterInfoContainer: {
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  reciterName: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: colors.black,
    marginBottom: 8,
    textAlign: "center",
  },
  surahInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.greenLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "center",
  },
  surahText: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: colors.green,
    marginLeft: 6,
  },
  ayahText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
  },
  playbackContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  playButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.green,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  progressContainer: {
    flex: 1,
  },
  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.greyLight,
    borderRadius: 3,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.green,
    borderRadius: 3,
  },
  timeText: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
    width: 40,
    textAlign: "center",
  },
});

export default ReciterAudioPlayer;
