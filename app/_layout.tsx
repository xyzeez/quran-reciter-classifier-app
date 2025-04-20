import { Stack } from "expo-router";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts as usePoppinsFonts,
} from "@expo-google-fonts/poppins";
import {
  Amiri_400Regular,
  Amiri_700Bold,
  useFonts as useAmiriFonts,
} from "@expo-google-fonts/amiri";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootLayout = () => {
  let [poppinsFontsLoaded] = usePoppinsFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  let [amiriFontsLoaded] = useAmiriFonts({
    Amiri_400Regular,
    Amiri_700Bold,
  });

  const [customFontsLoaded] = useFonts({
    surahnames: require("../assets/fonts/surahnames.ttf"),
    uthmanic_hafs: require("../assets/fonts/uthmanic_hafs.ttf"),
    qpchafs: require("../assets/fonts/QPCHafs.ttf"),
  });

  if (!poppinsFontsLoaded || !amiriFontsLoaded || !customFontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
};

export default RootLayout;
