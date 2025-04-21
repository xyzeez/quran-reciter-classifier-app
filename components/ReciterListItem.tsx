import colors from "@/constants/colors";
import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import { ReciterListItemProps } from "@/types/reciter";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 90,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: colors.crest,
  },
  imageWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.green + "20",
    overflow: "hidden",
  },
  image: {
    width: 50,
    height: 50,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
    paddingVertical: 6,
  },
  name: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: colors.black,
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "nowrap",
  },
  nationalityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.greenLight,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },
  flag: {
    width: 16,
    height: 12,
    marginRight: 4,
    borderRadius: 2,
  },
  nationality: {
    fontSize: 11,
    fontFamily: "Poppins_500Medium",
    color: colors.green,
    flexShrink: 1,
  },
});

const ReciterListItem = ({
  name,
  nationality,
  flagUrl,
  imageUrl,
  onPress,
}: ReciterListItemProps) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
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
            <Text style={styles.nationality} numberOfLines={1}>
              {nationality}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ReciterListItem;
