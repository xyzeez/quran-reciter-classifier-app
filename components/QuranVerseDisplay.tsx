import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { QuranVerseDisplayProps } from "@/types/ui";

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  text: {
    fontFamily: "qpchafs",
    fontSize: 24,
    textAlign: "justify",
    direction: "rtl",
  },
  textSpace: {
    width: 6,
  },
  ayahNumber: {
    fontSize: 28,
    color: colors.green,
  },
  readMoreButton: {
    position: "absolute",
    bottom: -16,
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: colors.green,
    borderRadius: 9999,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});

const QuranVerseDisplay = ({ text, ayahNumber }: QuranVerseDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const numberOfLines = isExpanded ? undefined : 7;

  const handleTextLayout = (event: any) => {
    const { lines } = event.nativeEvent;
    setShowReadMore(lines.length > 10);
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomWidth: showReadMore ? 1 : 0,
          borderColor: showReadMore ? colors.greyLight : "transparent",
          paddingBottom: showReadMore ? 24 : 0,
        },
      ]}
    >
      <Text
        style={styles.text}
        onTextLayout={handleTextLayout}
        numberOfLines={numberOfLines}
      >
        {text}
        <View style={styles.textSpace} />
        <Text style={styles.ayahNumber}>{ayahNumber}</Text>
      </Text>
      {showReadMore && (
        <View style={styles.readMoreButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default QuranVerseDisplay;
