import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { ActionButton } from "./ActionButton";

interface EmptyStateScreenProps {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  buttonText?: string;
  onButtonPress: () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: colors.white,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: colors.green,
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
    textAlign: "center",
    lineHeight: 24,
  },
});

export const EmptyStateScreen: React.FC<EmptyStateScreenProps> = ({
  title,
  description,
  iconName,
  buttonText = "Try Again",
  onButtonPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={60} color={colors.green} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <ActionButton
        label={buttonText}
        onPress={onButtonPress}
        iconName="refresh"
      />
    </View>
  );
};
