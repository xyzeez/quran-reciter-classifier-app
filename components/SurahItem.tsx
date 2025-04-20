import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

const styles = StyleSheet.create({
  container: {
    gap: 8,
    borderRadius: 8,
    paddingBlock: 10,
    paddingInline: 12,
    borderColor: colors.green,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  arabicText: {
    fontFamily: "qpchafs",
    fontWeight: "700",
    direction: "rtl",
    color: colors.grey,
  },
  englishText: {
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
    fontSize: 12,
    color: colors.grey,
  },
  content: {
    fontFamily: "qpchafs",
    fontSize: 20,
    textAlign: "justify",
    direction: "rtl",
  },
});

interface SurahItemProps {
  active?: boolean;
  surahNameArabic: string;
  surahNameEnglish: string;
  ayahNumberArabic: string;
  ayahNumberEnglish: string;
  text: string;
}

export const SurahItem = ({
  active = false,
  surahNameArabic,
  surahNameEnglish,
  ayahNumberArabic,
  ayahNumberEnglish,
  text,
}: SurahItemProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          borderWidth: active ? 2 : 1,
          backgroundColor: active ? colors.greenLight : "",
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.arabicText}>
          {surahNameArabic} : {ayahNumberArabic}
        </Text>
        <Text style={styles.englishText}>
          {surahNameEnglish} : {ayahNumberEnglish}
        </Text>
      </View>
      <Text style={styles.content} numberOfLines={2} ellipsizeMode="tail">
        {text}
      </Text>
    </View>
  );
};
