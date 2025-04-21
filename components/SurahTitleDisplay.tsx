import { View, Text, Image, StyleSheet } from "react-native";
import frame from "@/assets/frame.png";
import { SurahTitleDisplayProps } from "@/types/ui";

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 48,
  },
  frame: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  },
  content: {
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
    fontSize: 28,
    fontFamily: "surahnames",
    textAlign: "center",
  },
  arabicNumberContainer: {
    width: "10%",
  },
  arabicNumberText: {
    fontFamily: "qpchafs",
    textAlign: "center",
    fontWeight: "700",
  },
});

const SurahTitleDisplay = ({
  surahNumberArabic,
  surahNumberEnglish,
  surahNameArabic,
}: SurahTitleDisplayProps) => {
  return (
    <View style={styles.container}>
      <Image source={frame} style={styles.frame} />
      <View style={styles.content}>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{surahNumberEnglish}</Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>
            {surahNameArabic}
            {"\uE900"}
          </Text>
        </View>
        <View style={styles.arabicNumberContainer}>
          <Text style={styles.arabicNumberText}>{surahNumberArabic}</Text>
        </View>
      </View>
    </View>
  );
};

export default SurahTitleDisplay;
