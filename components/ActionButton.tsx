import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import { ActionButtonProps } from "@/types/ui";

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.green,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});

const ActionButton = ({
  label,
  onPress,
  iconName = "refresh",
  iconSize = 20,
  backgroundColor = colors.green,
}: ActionButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      {iconName && (
        <Ionicons name={iconName} size={iconSize} color={colors.white} />
      )}
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
