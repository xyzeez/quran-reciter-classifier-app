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

  if (!poppinsFontsLoaded || !amiriFontsLoaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(modals)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;
