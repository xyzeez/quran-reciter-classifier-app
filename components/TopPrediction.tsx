import { colors } from "@/constants/colors";
import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReciterCardProps } from "@/types/reciter";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 9999,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: colors.black,
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  nationalityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    width: 16,
    height: 12,
    marginRight: 6,
  },
  nationality: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
  },
  recordingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  recordingsCount: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: colors.green,
  },
  confidence: {
    width: 45,
    height: 45,
    backgroundColor: colors.greenLight,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.green,
  },
  confidenceText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    color: colors.green,
    marginTop: 4,
  },
});

const TopPrediction = ({
  name,
  nationality,
  flagUrl,
  confidence,
  imageUrl,
  onPress,
}: ReciterCardProps) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <View style={styles.bottomRow}>
          <View style={styles.nationalityContainer}>
            <Image
              source={{ uri: flagUrl }}
              style={styles.flag}
              resizeMode="cover"
            />
            <Text style={styles.nationality}>{nationality}</Text>
          </View>
          <View style={styles.recordingsContainer}>
            <Ionicons name="play" size={14} color={colors.green} />
            <Text style={styles.recordingsCount}>Listen</Text>
          </View>
        </View>
      </View>
      <View style={styles.confidence}>
        <Text style={styles.confidenceText}>{confidence}%</Text>
      </View>
    </Pressable>
  );
};

export default TopPrediction;
