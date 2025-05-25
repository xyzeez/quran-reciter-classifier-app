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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import {
  BottomSheetProvider,
  useBottomSheet,
} from "@/contexts/BottomSheetContext";
import React, { useMemo, useRef, useCallback } from "react";
import colors from "@/constants/colors";

const AppContent = () => {
  const { isSheetOpen, sheetContent, closeSheet } = useBottomSheet();
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  const bottomSheetIndex = isSheetOpen ? 0 : -1;

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)" options={{ headerShown: false }} />
      </Stack>
      <BottomSheet
        ref={sheetRef}
        index={bottomSheetIndex}
        snapPoints={snapPoints}
        onChange={(index) => {
          const currentlyOpen = index !== -1;
          if (isSheetOpen && !currentlyOpen) {
            closeSheet();
          } else if (!isSheetOpen && currentlyOpen) {
            closeSheet();
          }
        }}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{
          backgroundColor: colors.green,
          width: 40,
          height: 4,
        }}
      >
        <BottomSheetView>{sheetContent}</BottomSheetView>
      </BottomSheet>
    </>
  );
};

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetProvider>
          <AppContent />
        </BottomSheetProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
