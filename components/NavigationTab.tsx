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

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    flex: 1,
  },
});

const NavigationTab = ({ title }: NavigationTabProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        header: () => (
          <View
            style={[
              styles.header,
              { paddingTop: Platform.OS === "ios" ? insets.top : 16 },
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
          </View>
        ),
      }}
    />
  );
};

export default NavigationTab;
