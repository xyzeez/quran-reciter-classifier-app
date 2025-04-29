import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import frame from "@/assets/frame.png";

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingTop: 16,
  },
  text: {
    fontFamily: "qpchafs",
    fontSize: 24,
    textAlign: "justify",
    direction: "rtl",
    marginTop: 16,
  },
  textSpace: {
    width: 6,
  },
  ayahNumber: {
    fontSize: 28,
    color: colors.green,
  },
  readMoreButton: {
    position: "absolute",
    bottom: -16,
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: colors.green,
    borderRadius: 9999,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    position: "relative",
    height: 48,
    marginBottom: 18,
  },
  titleFrame: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  },
  titleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "10%",
    height: "100%",
    paddingInline: "10%",
  },
  numberContainer: {
    width: "10%",
  },
  numberText: {
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
    fontSize: 12,
    marginBottom: -2,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    direction: "rtl",
    width: "60%",
    paddingRight: 10,
  },
  nameText: {
    fontSize: Platform.select({ ios: 34, default: 28 }),
    fontFamily: "surahnames",
    textAlign: "center",
    lineHeight: Platform.select({ ios: 40, default: 32 }),
  },
  arabicNumberContainer: {
    width: "10%",
  },
  arabicNumberText: {
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
    fontSize: 12,
    marginBottom: -2,
  },
  englishNameContainer: {
    position: "absolute",
    top: "95%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  englishNameText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: colors.green,
    textAlign: "center",
    backgroundColor: colors.greenLight,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
  },
});

interface QuranVerseDisplayProps {
  ayah_text: string;
  ayah_number: string;
  surah_name_en: string;
  surah_number: string;
  surah_number_en: number | string;
  unicode: string;
  isSingleResult?: boolean;
  scrollViewRef?: React.RefObject<ScrollView>;
}

const QuranVerseDisplay = ({
  ayah_text,
  ayah_number,
  surah_name_en,
  surah_number,
  surah_number_en,
  unicode,
  isSingleResult = false,
  scrollViewRef,
}: QuranVerseDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  const applyTruncation = showReadMore && !isSingleResult;

  const numberOfLines = applyTruncation && !isExpanded ? 7 : undefined;

  const handleTextLayout = (event: any) => {
    if (!isSingleResult) {
      const { lines } = event.nativeEvent;
      setShowReadMore(lines.length > 7);
    }
  };

  const handleToggleExpand = () => {
    const collapsing = isExpanded;
    setIsExpanded(!isExpanded);

    if (collapsing && scrollViewRef?.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomWidth: applyTruncation ? 1 : 0,
          borderColor: applyTruncation ? colors.greyLight : "transparent",
          paddingBottom: applyTruncation ? 24 : 0,
        },
      ]}
    >
      <View style={styles.titleContainer}>
        <Image source={frame} style={styles.titleFrame} />
        <View style={styles.titleContent}>
          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>
              {typeof surah_number_en === "number"
                ? surah_number_en.toString()
                : surah_number_en}
            </Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>
              {unicode}
              {"\uE900"}
            </Text>
          </View>
          <View style={styles.arabicNumberContainer}>
            <Text style={styles.arabicNumberText}>{surah_number}</Text>
          </View>
        </View>

        <View style={styles.englishNameContainer}>
          <Text style={styles.englishNameText}>{surah_name_en}</Text>
        </View>
      </View>

      <Text
        style={styles.text}
        onTextLayout={handleTextLayout}
        numberOfLines={numberOfLines}
      >
        {ayah_text}
        <View style={styles.textSpace} />
        <Text style={styles.ayahNumber}>{ayah_number}</Text>
      </Text>

      {applyTruncation && (
        <View style={styles.readMoreButton}>
          <TouchableOpacity style={styles.button} onPress={handleToggleExpand}>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default QuranVerseDisplay;
