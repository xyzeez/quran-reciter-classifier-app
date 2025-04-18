import { colors } from "@/constants/colors";
import { View, Text, Image, StyleSheet } from "react-native";
import { Reciter } from "@/types/reciter";
import { Ionicons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 9999,
  },
  confidence: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 45,
    height: 45,
    backgroundColor: colors.white,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.green,
  },
  confidenceText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: colors.green,
    textAlign: "center",
    marginTop: 4,
  },
  name: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    color: colors.green,
    textAlign: "center",
  },
  innerContainer: {
    gap: 8,
  },
  detailsContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  flag: {
    width: 24,
    height: 16,
    borderRadius: 9999,
  },
  nationality: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: colors.black,
    textAlign: "center",
  },
  recordingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  recordingsCount: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: colors.black,
  },
});

const ReciterPredicted = ({ reciter }: { reciter: Reciter }) => {
  return (
    <View style={styles.container}>
      <View>
        <Image source={{ uri: reciter.imageUrl }} style={styles.image} />
        <View style={styles.confidence}>
          <Text style={styles.confidenceText}>{reciter.confidence}%</Text>
        </View>
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {reciter.name}
        </Text>
        <View style={styles.detailsContainer}>
          <View style={styles.recordingsContainer}>
            <Image
              style={styles.flag}
              source={{ uri: reciter.flagUrl }}
              resizeMode="cover"
            />
            <Text style={styles.recordingsCount}>{reciter.nationality}</Text>
          </View>
          <View style={styles.recordingsContainer}>
            <Ionicons name="play" size={14} color={colors.green} />
            <Text style={styles.recordingsCount}>Listen</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReciterPredicted;
