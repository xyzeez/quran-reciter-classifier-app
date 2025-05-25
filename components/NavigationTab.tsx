import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import colors from "@/constants/colors";
import { NavigationTabProps } from "@/types/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomSheet } from "@/contexts/BottomSheetContext";
import Settings from "@/components/Settings";
import React from "react";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.green}20`,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    color: colors.green,
    flexShrink: 1,
    marginRight: 8,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
  },
});

const NavigationTab = ({ title, showSettingsButton }: NavigationTabProps) => {
  const insets = useSafeAreaInsets();
  const { openSheet } = useBottomSheet();

  const handleSettingsPress = () => {
    openSheet(<Settings />);
  };

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        header: () => (
          <View
            style={[
              styles.header,
              { paddingTop: Platform.OS === "ios" ? insets.top + 16 : 16 },
            ]}
          >
            <View style={styles.titleContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={22} color={colors.green} />
              </TouchableOpacity>
              <Text
                style={styles.headerTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
            </View>
            {showSettingsButton && (
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={handleSettingsPress}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={colors.green}
                />
              </TouchableOpacity>
            )}
          </View>
        ),
      }}
    />
  );
};

export default NavigationTab;
