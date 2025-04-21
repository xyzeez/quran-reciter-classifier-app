import colors from "@/constants/colors";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const tabStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 32,
    marginInline: 16,
    height: 48,
    borderRadius: 9999,
    backgroundColor: colors.white,
  },
  default: {
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    marginTop: 10,
  },
  active: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 48,
    width: 110,
    marginTop: 10,
    borderRadius: 9999,
    backgroundColor: colors.green,
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconActive: {
    width: 18,
    height: 18,
  },
  text: {
    fontFamily: "Poppins_400Regular",
    color: colors.white,
    fontSize: 16,
  },
});

const TabIcon = ({
  focused,
  title,
  iconName,
}: {
  focused: boolean;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
}) => {
  return (
    <View style={focused ? tabStyles.active : tabStyles.default}>
      <Ionicons
        name={iconName}
        size={focused ? 18 : 24}
        color={focused ? colors.white : colors.green}
      />
      {focused && <Text style={tabStyles.text}>{title}</Text>}
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: tabStyles.container,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Qari",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title="Qari" iconName="mic" />
          ),
        }}
      />
      <Tabs.Screen
        name="ayah"
        options={{
          title: "Ayah",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title="Ayah" iconName="book-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title="Search" iconName="search" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
