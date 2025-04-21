import { View, Text, StyleSheet } from "react-native";
import colors from "@/constants/colors";
import { SurahListItemProps } from "@/types/ui";

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

const SurahListItem = ({
  active = false,
  surah_name,
  surah_name_en,
  ayah_number,
  ayah_number_en,
  ayah_text,
}: SurahListItemProps) => {
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
          {surah_name} : {ayah_number}
        </Text>
        <Text style={styles.englishText}>
          {surah_name_en} :{" "}
          {typeof ayah_number_en === "number"
            ? ayah_number_en.toString()
            : ayah_number_en}
        </Text>
      </View>
      <Text style={styles.content} numberOfLines={2} ellipsizeMode="tail">
        {ayah_text}
      </Text>
    </View>
  );
};

export default SurahListItem;
