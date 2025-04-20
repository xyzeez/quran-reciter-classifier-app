import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

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

interface ListTitleProps {
  count: number;
}

export const ListTitle = ({ count }: ListTitleProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>All Identified Ayahs</Text>
      <View style={styles.separator} />
      <View style={styles.countContainer}>
        <Text style={styles.count}>{count}</Text>
      </View>
    </View>
  );
};
