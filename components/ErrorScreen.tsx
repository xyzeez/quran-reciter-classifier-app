import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import ActionButton from "./ActionButton";
import { ErrorScreenProps } from "@/types/ui";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    color: colors.red,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
    color: colors.black,
    textAlign: "center",
  },
  description: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: colors.grey,
    textAlign: "center",
  },
  icon: {
    marginBottom: 16,
  },
});

const ErrorScreen = ({
  title,
  subtitle,
  description,
  iconName,
  buttonText = "Try Again",
  onButtonPress,
}: ErrorScreenProps) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name={iconName}
        size={100}
        color={colors.red}
        style={styles.icon}
      />
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

export default ErrorScreen;
