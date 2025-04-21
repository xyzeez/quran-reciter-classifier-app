import { StyleSheet, TextInput, View } from "react-native";
import colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { ReciterSearchBarProps } from "@/types/ui";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 9999,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.green,
  },
  input: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: colors.black,
  },
});

const ReciterSearchBar = ({
  value,
  onChangeText,
  placeholder = "Search...",
}: ReciterSearchBarProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={24} color={colors.green} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        cursorColor={colors.green}
      />
    </View>
  );
};

export default ReciterSearchBar;
