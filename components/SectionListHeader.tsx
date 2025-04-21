import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

interface SectionListHeaderProps {
  title: string;
  count?: number;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
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

export const SectionListHeader: React.FC<SectionListHeaderProps> = ({
  title,
  count,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.separator} />
      {count !== undefined && (
        <View style={styles.countContainer}>
          <Text style={styles.count}>{count}</Text>
        </View>
      )}
    </View>
  );
};
