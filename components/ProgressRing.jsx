import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ProgressRing({ size = 80, stroke = 10, progress }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withTiming(progress, { duration: 700 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - p.value)
  }));

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size}>
        <Circle cx={size/2} cy={size/2} r={radius} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size/2} cy={size/2} r={radius}
          stroke="#E53935" strokeWidth={stroke} strokeLinecap="round" fill="none"
          strokeDasharray={`${circumference}, ${circumference}`}
          animatedProps={animatedProps}
        />
      </Svg>
      <Text style={{ position: "absolute", fontWeight: "700" }}>{Math.round(progress * 100)}%</Text>
    </View>
  );
}
