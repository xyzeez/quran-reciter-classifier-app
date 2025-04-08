import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: colors.black,
  },
});

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search...",
}: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={24} color={colors.green} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
      />
    </View>
  );
};
