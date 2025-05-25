import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    color: colors.black,
    marginBottom: 24,
    textAlign: "center",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyLight,
    marginTop: 12,
  },
  firstSettingItem: {
    marginTop: 0,
  },
  languageDropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyLight,
    backgroundColor: colors.greyLight + "20",
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: colors.grey,
  },
  settingsItem: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
  },
  settingValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.black,
    marginRight: 8,
  },
  themeOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.greyLight,
    paddingBottom: 16,
    marginBottom: 8,
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.green,
  },
  themeButtonSelected: {
    backgroundColor: colors.green,
  },
  themeButtonText: {
    fontFamily: "Poppins_400Regular",
    color: colors.green,
  },
  themeButtonTextSelected: {
    color: colors.white,
  },
});

const Settings = () => {
  const [currentLanguage, setCurrentLanguage] = React.useState("English");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] =
    React.useState(false);
  const [currentTheme, setCurrentTheme] = React.useState("Light");

  const handleLanguageSelect = (language: string) => {
    setCurrentLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Language Setting - No separate title, label acts as title */}
      <TouchableOpacity
        style={[styles.settingItem, styles.firstSettingItem]}
        onPress={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
      >
        <Text style={styles.settingLabel}>Language</Text>
        <View style={styles.settingValueContainer}>
          <Text style={styles.settingValue}>{currentLanguage}</Text>
          <Ionicons
            name={isLanguageDropdownOpen ? "chevron-down" : "chevron-forward"}
            size={20}
            color={colors.grey}
          />
        </View>
      </TouchableOpacity>

      {isLanguageDropdownOpen && (
        <View>
          <TouchableOpacity
            style={styles.languageDropdownItem}
            onPress={() => handleLanguageSelect("English")}
          >
            <Text style={styles.settingsItem}>English</Text>
            {currentLanguage === "English" && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.green}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.languageDropdownItem}
            onPress={() => handleLanguageSelect("Arabic")}
          >
            <Text style={styles.settingsItem}>العربية</Text>
            {currentLanguage === "Arabic" && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.green}
              />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Theme Setting - No separate title, label acts as title */}
      <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
        <Text style={styles.settingLabel}>Theme</Text>
      </View>
      <View style={styles.themeOptionContainer}>
        <TouchableOpacity
          style={[
            styles.themeButton,
            currentTheme === "Light" && styles.themeButtonSelected,
          ]}
          onPress={() => setCurrentTheme("Light")}
        >
          <Text
            style={[
              styles.themeButtonText,
              currentTheme === "Light" && styles.themeButtonTextSelected,
            ]}
          >
            Light
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.themeButton,
            currentTheme === "Dark" && styles.themeButtonSelected,
          ]}
          onPress={() => setCurrentTheme("Dark")}
        >
          <Text
            style={[
              styles.themeButtonText,
              currentTheme === "Dark" && styles.themeButtonTextSelected,
            ]}
          >
            Dark
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.themeButton,
            currentTheme === "System" && styles.themeButtonSelected,
          ]}
          onPress={() => setCurrentTheme("System")}
        >
          <Text
            style={[
              styles.themeButtonText,
              currentTheme === "System" && styles.themeButtonTextSelected,
            ]}
          >
            System
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;
