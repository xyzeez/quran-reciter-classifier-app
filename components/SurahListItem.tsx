import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "@/constants/colors";
import { SurahListItemProps } from "@/types/ui";

const styles = StyleSheet.create({
  container: {
    gap: 10,
    borderRadius: 12,
    padding: 14,
    borderColor: colors.green + "30",
    borderWidth: 1,
  },
  containerActive: {
    borderColor: colors.green,
    backgroundColor: colors.greenLight,
    borderWidth: 1.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    alignItems: "flex-start",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  surahNameEnglish: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: colors.black,
  },
  ayahNumberEnglish: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: colors.grey,
  },
  surahNameArabic: {
    fontFamily: "qpchafs",
    fontSize: 18,
    fontWeight: "700",
    direction: "rtl",
    color: colors.black,
  },
  ayahNumberArabic: {
    fontSize: 14,
    direction: "rtl",
    color: colors.grey,
  },
  content: {
    fontFamily: "qpchafs",
    fontSize: 20,
    textAlign: "justify",
    direction: "rtl",
    lineHeight: 30,
    color: colors.black,
  },
});

const SurahListItem = ({
  active = false,
  surah_name,
  surah_name_en,
  surah_number,
  surah_number_en,
  ayah_number,
  ayah_text,
  onPress,
}: SurahListItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.container, active && styles.containerActive]}>
        <View style={styles.header}>
          {/* English Info - Left */}
          <View style={styles.headerLeft}>
            <Text style={styles.surahNameEnglish}>{surah_name_en}</Text>
            <Text style={styles.ayahNumberEnglish}>
              Surah:{" "}
              {typeof surah_number_en === "number"
                ? surah_number_en.toString()
                : surah_number_en}
            </Text>
          </View>

          {/* Arabic Info - Right */}
          <View style={styles.headerRight}>
            <Text style={styles.surahNameArabic}>{surah_name}</Text>
            <Text style={styles.ayahNumberArabic}>سورة : {surah_number}</Text>
          </View>
        </View>

        {/* Ayah Text */}
        <Text style={styles.content} numberOfLines={2} ellipsizeMode="tail">
          {ayah_text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SurahListItem;
