import { FC, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  useDerivedValue,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import colors from "@/constants/colors";
import { CircularConfidenceLoaderProps } from "@/types/ui";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularConfidenceLoader: FC<CircularConfidenceLoaderProps> = ({
  confidence,
  size = 45,
  strokeWidth = 3,
  textSize = 12,
  style,
  animated = true,
}) => {
  // Validate and normalize confidence (0-100)
  const normalizedConfidence = Math.min(100, Math.max(0, confidence));

  // Animation progress value
  const progress = useSharedValue(0);

  // Determine color based on confidence level
  const getConfidenceColor = (value: number) => {
    if (value >= 80) return colors.green;
    if (value >= 60) return "#88A044"; // Lighter green
    if (value >= 40) return "#CCAA36"; // Yellow
    if (value >= 20) return "#E67E22"; // Orange
    return colors.red; // Red for low confidence
  };

  const confidenceColor = getConfidenceColor(normalizedConfidence);

  // Calculate the circle dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate the animated stroke dashoffset
  const strokeDashoffset = useDerivedValue(() => {
    return circumference * (1 - progress.value / 100);
  });

  // Animated props for the circle
  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: strokeDashoffset.value,
    };
  });

  // Start the animation when the component mounts or confidence changes
  useEffect(() => {
    if (animated) {
      progress.value = withTiming(normalizedConfidence, {
        duration: 1000,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      progress.value = normalizedConfidence;
    }
  }, [normalizedConfidence, animated, progress]);

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg style={styles.svg} width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.greyLight}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={confidenceColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedCircleProps}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* Percentage Text */}
      <Text
        style={[
          styles.confidenceText,
          {
            fontSize: textSize,
            color: confidenceColor,
          },
        ]}
      >
        {Math.floor(normalizedConfidence)}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.green,
    position: "relative",
  },
  svg: {
    position: "absolute",
  },
  confidenceText: {
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    marginTop: 4,
    zIndex: 1,
  },
});

export default CircularConfidenceLoader;
