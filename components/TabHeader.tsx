import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "@/constants/colors";
import { TabHeaderProps } from "@/types/ui";

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    marginBottom: 24,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  heading: {
    fontSize: 26,
    fontFamily: "Poppins_600SemiBold",
    color: colors.green,
    textAlign: "center",
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
    textAlign: "center",
    maxWidth: "90%",
  },
});

const TabHeader: React.FC<TabHeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.heading}>{title}</Text>
      <Text style={styles.text}>{subtitle}</Text>
    </View>
  );
};

export default TabHeader;
