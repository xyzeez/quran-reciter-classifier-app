import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";

interface SearchHeaderProps {
  query: string;
  count: number;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 16,
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

export function SearchHeader({ query, count }: SearchHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {query ? `Search results for: ${query}` : "All reciters"}
      </Text>
      <View style={styles.separator} />
      <View style={styles.countContainer}>
        <Text style={styles.count}>{count}</Text>
      </View>
    </View>
  );
}
