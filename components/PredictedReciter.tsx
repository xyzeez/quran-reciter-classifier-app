import colors from "@/constants/colors";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Reciter } from "@/types/reciter";
import { Ionicons } from "@expo/vector-icons";
import CircularConfidenceLoader from "./CircularConfidenceLoader";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: colors.green + "20", // 20% opacity
  },
  confidenceContainer: {
    position: "absolute",
    bottom: -10,
    right: -10,
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  name: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 22,
    color: colors.green,
    textAlign: "center",
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  nationalityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.greenLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  flag: {
    width: 22,
    height: 14,
    borderRadius: 2,
    marginRight: 8,
  },
  nationality: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: colors.green,
  },
  listenButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.green,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  listenText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: colors.white,
  },
});

const PredictedReciter = ({
  reciter,
  listenHandler,
}: {
  reciter: Reciter;
  listenHandler: () => void;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: reciter.imageUrl }} style={styles.image} />
        <View style={styles.confidenceContainer}>
          <CircularConfidenceLoader
            confidence={reciter.confidence}
            size={50}
            textSize={16}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {reciter.name}
        </Text>

        <View style={styles.detailsRow}>
          <View style={styles.nationalityContainer}>
            <Image
              style={styles.flag}
              source={{ uri: reciter.flagUrl }}
              resizeMode="cover"
            />
            <Text style={styles.nationality}>{reciter.nationality}</Text>
          </View>

          <Pressable style={styles.listenButton} onPress={listenHandler}>
            <Ionicons name="play-circle" size={18} color={colors.white} />
            <Text style={styles.listenText}>Listen</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default PredictedReciter;
