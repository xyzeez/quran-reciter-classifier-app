import { useState, useEffect, useRef } from "react";
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
import colors from "../constants/colors";
import ActionButton from "./ActionButton";
import { SurahAyahData } from "../types/ayah";

export interface ReciterAudioPlayerProps {
  reciter: {
    name: string;
    nationality: string;
    imageUrl: string;
    confidence: number;
    serverUrl?: string;
  };
  surahAyahData: SurahAyahData | null;
  onNeedAyahData: () => Promise<void>;
  isLoadingAyah: boolean;
}

const formatTime = (millis: number | null): string => {
  if (millis === null) return "--:--";
  const totalSeconds = Math.floor(millis / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const ReciterAudioPlayer = ({
  reciter,
  surahAyahData,
  onNeedAyahData,
  isLoadingAyah,
}: ReciterAudioPlayerProps) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [durationMillis, setDurationMillis] = useState<number | null>(null);
  const [positionMillis, setPositionMillis] = useState<number>(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Construct the audio URL based on reciter's serverUrl
  const getAudioUrl = () => {
    if (!surahAyahData || !reciter.serverUrl) return null;

    // Format surah and ayah numbers with leading zeros
    const formattedSurah = String(surahAyahData.surah_number_en).padStart(
      3,
      "0"
    );
    const formattedAyah = String(surahAyahData.ayah_number_en).padStart(3, "0");

    // Construct the URL for everyayah.com format
    const finalUrl = `${reciter.serverUrl}${formattedSurah}${formattedAyah}.mp3`;

    console.log("🎵 Audio URL Construction:", {
      reciter: reciter.name,
      surah: surahAyahData.surah_number_en,
      ayah: surahAyahData.ayah_number_en,
      serverUrl: reciter.serverUrl,
      finalUrl,
    });

    return finalUrl;
  };

  const handlePlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if (!isMountedRef.current) return;

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

    setPositionMillis(successStatus.positionMillis);
    setDurationMillis(successStatus.durationMillis ?? null);

    // Handle audio completion
    if (successStatus.didJustFinish) {
      try {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.setPositionAsync(0);
        }
        setIsPlaying(false);
        setPositionMillis(0);
      } catch (error) {
        console.error("Error handling audio completion:", error);
      }
    } else {
      setIsPlaying(successStatus.isPlaying);
    }

    setError(null);
  };

  useEffect(() => {
    const initializeAudio = async () => {
      if (!surahAyahData && !isLoadingAyah) {
        try {
          await onNeedAyahData();
        } catch (error: any) {
          console.error("Failed to fetch ayah data:", error);
          setError("Failed to load ayah information");
          setIsLoading(false);
        }
        return;
      }

      if (surahAyahData) {
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

          const audioUrl = getAudioUrl();
          if (!audioUrl) {
            throw new Error("Could not construct audio URL");
          }

          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: audioUrl },
            {
              shouldPlay: false,
              progressUpdateIntervalMillis: 50,
              isLooping: false,
              positionMillis: 0,
            },
            handlePlaybackStatusUpdate
          );

          if (isMountedRef.current) {
            if (soundRef.current) {
              await soundRef.current.stopAsync();
              await soundRef.current.unloadAsync();
            }
            soundRef.current = newSound;
            setSound(newSound);
            setIsReady(true);
            setIsLoading(false);

            try {
              await newSound.playAsync();
              setIsPlaying(true);
            } catch (playError: any) {
              console.error("Failed to auto-play:", playError);
              throw new Error(
                `Failed to play audio: ${playError?.message || "Unknown error"}`
              );
            }
          }
        } catch (e: any) {
          console.error("Failed to load sound", e);
          if (isMountedRef.current) {
            setError(`We couldn't load this audio. Please try again later.`);
            setIsLoading(false);
            setIsReady(false);
          }
        }
      }
    };

    initializeAudio();

    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync().then(() => {
          if (soundRef.current) {
            soundRef.current.unloadAsync();
            soundRef.current = null;
          }
        });
      }
    };
  }, [surahAyahData, isLoadingAyah, onNeedAyahData]);

  const playPauseAudio = async () => {
    const currentSound = soundRef.current;
    if (!currentSound || !isReady || isLoading) return;

    try {
      if (isPlaying) {
        await currentSound.pauseAsync();
        setIsPlaying(false);
      } else {
        // If we're at the end or near the end, reset to beginning
        if (positionMillis >= (durationMillis ?? 0) - 100) {
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

  const normalizedConfidence =
    reciter.confidence !== undefined
      ? Math.min(100, Math.max(0, reciter.confidence))
      : null;

  const confidencePercent =
    normalizedConfidence !== null ? Math.floor(normalizedConfidence) : null;

  const getConfidenceColor = (value: number | null) => {
    if (value === null) return colors.green;
    if (value >= 80) return colors.green;
    if (value >= 60) return "#88A044";
    if (value >= 40) return "#CCAA36";
    if (value >= 20) return "#E67E22";
    return colors.red;
  };

  const confidenceColor = getConfidenceColor(normalizedConfidence);

  if (isLoadingAyah) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.loadingText}>Loading Ayah Information...</Text>
        </View>
      </View>
    );
  }

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
        {surahAyahData && (
          <View style={styles.surahInfoContainer}>
            <Ionicons name="book-outline" size={16} color={colors.green} />
            <Text style={styles.surahText}>
              {surahAyahData.surah_name_en}{" "}
              <Text style={styles.ayahText}>
                • Ayah{" "}
                {surahAyahData.ayah_number || surahAyahData.ayah_number_en}
              </Text>
            </Text>
          </View>
        )}
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
