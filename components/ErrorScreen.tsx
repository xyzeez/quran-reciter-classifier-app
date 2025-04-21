import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { ActionButton } from "./ActionButton";

interface ErrorScreenProps {
  title: string;
  subtitle?: string;
  description?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: colors.red,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: colors.grey,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
});

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title,
  subtitle,
  description,
  iconName = "alert-circle-outline",
  buttonText = "Try Again",
  onButtonPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={40} color={colors.red} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}
      <ActionButton
        label={buttonText}
        onPress={onButtonPress}
        iconName="refresh"
      />
    </View>
  );
};
