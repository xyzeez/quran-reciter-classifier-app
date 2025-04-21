import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "@/constants/colors";
import { NavigationTabProps } from "@/types/ui";

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
  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: colors.green,
  },
});

const NavigationTab = ({ title }: NavigationTabProps) => {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        header: () => (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.green} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
        ),
      }}
    />
  );
};

export default NavigationTab;
