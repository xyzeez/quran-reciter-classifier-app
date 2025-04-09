import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

// Data for Basmala text
const basmalaData = {
  ayat_arab: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
};

const styles = StyleSheet.create({
  container: {
    height: "auto",
    width: "100%",
    marginBottom: 24,
    marginHorizontal: 16,
  },
  frameContainer: {
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 12,
    backgroundColor: colors.greenLight,
  },
  decorativeBorder: {
    position: "absolute",
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderWidth: 2,
    borderColor: colors.green,
    borderRadius: 12,
    opacity: 0.3,
  },
  arabicText: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Amiri_400Regular",
    color: colors.black,
  },
  cornerDecoration: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: colors.green,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
});

const Basmala = () => {
  return (
    <View style={styles.container}>
      <View style={styles.frameContainer}>
        <View style={styles.decorativeBorder} />
        <View style={[styles.cornerDecoration, styles.topLeft]} />
        <View style={[styles.cornerDecoration, styles.topRight]} />
        <View style={[styles.cornerDecoration, styles.bottomLeft]} />
        <View style={[styles.cornerDecoration, styles.bottomRight]} />
        <Text style={styles.arabicText}>{basmalaData.ayat_arab}</Text>
      </View>
    </View>
  );
};

export default Basmala;
