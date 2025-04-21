import { View, Text, StyleSheet } from "react-native";
import colors from "@/constants/colors";
import { SectionListHeaderProps } from "@/types/ui";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: colors.greyLight,
    marginHorizontal: 12,
  },
  countContainer: {
    backgroundColor: colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  count: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
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
          <Text style={styles.count}>{count}</Text>
        </View>
      )}
    </View>
  );
};

export default SectionListHeader;
