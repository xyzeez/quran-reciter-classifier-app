import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import colors from "@/constants/colors";
import { LoadingScreenProps } from "@/types/ui";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  message: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: colors.grey,
    textAlign: "center",
    marginTop: 16,
  },
});

const LoadingScreen = ({ message }: LoadingScreenProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.green} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default LoadingScreen;
