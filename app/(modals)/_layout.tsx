import { Stack } from "expo-router";

const ModalsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        animation: "slide_from_bottom",
      }}
    />
  );
};

export default ModalsLayout;
