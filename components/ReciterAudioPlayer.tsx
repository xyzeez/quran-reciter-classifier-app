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

// Test data for development
const reciterData = {
  confidence: 0.951532371788925957,
  flagUrl: "https://flagcdn.com/w40/eg.png",
  imageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Abdul-Rahman_Al-Sudais_%28Cropped%2C_2011%29.jpg/449px-Abdul-Rahman_Al-Sudais_%28Cropped%2C_2011%29.jpg",
  name: "Mahmoud Khalil Al-Hussary",
  nationality: "Egypt",
  serverUrl: "https://quran.ksu.edu.sa/ayat/mp3/Husary_64kbps/",
};

const audioUrl = "https://everyayah.com/data/Alafasy_128kbps/001001.mp3";
const surahName = "Al-Fatiha";
const ayahNumber = 1;

const ReciterAudioPlayer = () => {
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

  const formatTime = (millis: number | null): string => {
    if (millis === null) return "--:--";
    const totalSeconds = Math.floor(millis / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    let isMounted = true;
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

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          {
            shouldPlay: false,
            progressUpdateIntervalMillis: 50,
          },
          (status) => {
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

            if (successStatus.didJustFinish && !successStatus.isLooping) {
              setIsPlaying(false);
              setPositionMillis(0);

              // Reset audio position on finish
              if (soundRef.current) {
                soundRef.current.stopAsync().then(() => {
                  soundRef.current?.setPositionAsync(0);
                });
              }
            }

            setError(null);
          }
        );

        if (isMounted) {
          // Cleanup previous sound instance
          if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
          }
          soundRef.current = newSound;
          setSound(newSound);
          setIsReady(true);
          setIsLoading(false);
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
  }, [audioUrl]);

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

  const confidencePercent = Math.round(reciterData.confidence * 100);

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
        <Image
          source={{ uri: reciterData.imageUrl }}
          style={styles.reciterImage}
        />
        <View style={styles.confidenceContainer}>
          <View style={styles.confidenceCircle}>
            <Text style={styles.confidenceText}>{confidencePercent}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.reciterInfoContainer}>
        <Text style={styles.reciterName}>{reciterData.name}</Text>
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
