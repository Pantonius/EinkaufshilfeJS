import { StyleSheet, Animated, View } from "react-native";
import { useRef, useEffect } from "react";
import Easing from "react-native/Libraries/Animated/Easing";
import { CommonStyles } from "../style/CommonStyles";

export default function LoadingIndicator({ baseColor, accentColor }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.bezier(.1, .5, .9, .5),
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View style={[styles.indicator, baseColor && { backgroundColor: baseColor }]}>
      <Animated.View style={[styles.indicatorFill, accentColor && { backgroundColor: accentColor },
       {
        transform: [
          { 
            rotate: rotation.interpolate(
              {
                inputRange: [0, 1],
                outputRange: ['0rad', (2 * Math.PI) + 'rad'],
              }
            )
          },
          {
            perspective: 1000
          },
          {
            translateX: radius / 2
          }
        ]
      }]}>
      </Animated.View>
      <View style={[styles.innerCircle, baseColor && { backgroundColor: baseColor }]} />
    </View>
  );
}

const radius = 20;
const styles = StyleSheet.create({

  indicator: {
    width: radius,
    height: radius,
    backgroundColor: 'white',
    borderRadius: radius,
    overflow: "hidden",
  },

  indicatorFill: {
    width: radius,
    height: radius,
    backgroundColor: CommonStyles.neutral.color,
  },

  innerCircle: {
    width: radius * .8,
    height: radius * .8,
    top: (radius * .2) / 2,
    left: (radius * .2) / 2,

    borderRadius: radius,

    backgroundColor: 'white',
    position: 'absolute',
  },
});