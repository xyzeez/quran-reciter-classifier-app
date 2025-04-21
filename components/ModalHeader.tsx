import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

interface ModalHeaderProps {
  title: string;
  onBackPress: () => void;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.crest,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: colors.green,
  },
});

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  onBackPress,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color={colors.green} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};
