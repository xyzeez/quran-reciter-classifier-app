import { View, Text, StyleSheet } from "react-native";
import colors from "@/constants/colors";
import { SectionListHeaderProps } from "@/types/ui";
import { Ionicons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 2,
  },
  text: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: colors.black,
  },
  separator: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.greyLight,
    marginHorizontal: 14,
    borderRadius: 1,
  },
  countContainer: {
    backgroundColor: colors.greenLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  count: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: colors.green,
  },
});

const SectionListHeader = ({
  count,
  title = "All Identified Ayahs",
}: SectionListHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <View style={styles.separator} />
      {count !== undefined && (
        <View style={styles.countContainer}>
          <Ionicons name="layers-outline" size={14} color={colors.green} />
          <Text style={styles.count}>{count}</Text>
        </View>
      )}
    </View>
  );
};

export default SectionListHeader;
