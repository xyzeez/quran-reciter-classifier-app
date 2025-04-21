import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

interface LoadingScreenProps {
  message?: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.crest,
    gap: 16,
  },
  text: {
    fontFamily: "Poppins_400Regular",
    color: colors.green,
    fontSize: 16,
  },
});

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.green} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};
