import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Image, Animated, Easing, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import lesiiskole_logo from "../assets/lesiiskole_logo.png";

const { width } = Dimensions.get("window");

export default function TopBar({ onPressNotification }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Run every 10s: (animate 900ms) + (wait ~9100ms)
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(9100),
        Animated.timing(t, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [t]);

  // Move stripe across the logo strongly so you can see it
  const translateX = t.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, 180],
  });

  return (
    <View style={styles.topBar}>
      {/* Logo + glare */}
      <View style={styles.logoWrap}>
        <Image source={lesiiskole_logo} style={styles.logo} resizeMode="contain" />

        {/* Glare stripe overlay */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glareWrap,
            {
              transform: [{ translateX }, { rotate: "-25deg" }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(255,255,255,0)",
              "rgba(255,255,255,0.85)",
              "rgba(255,255,255,0)",
            ]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.glare}
          />
        </Animated.View>
      </View>

      {/* Notification (NO animation) */}
      <Pressable onPress={onPressNotification} hitSlop={10} style={styles.iconBtn}>
        <Ionicons name="notifications-outline" size={26} color="#000" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width,
    height: 70,
    backgroundColor: "#FDFEFF",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

  
  },

  logoWrap: {
    width: 150,
    height: 46,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
  },

  logo: {
    width: "100%",
    height: "100%",
  },

  // container for moving stripe
  glareWrap: {
    position: "absolute",
    top: -40,
    left: 0,
    width: 90,
    height: 140,
    opacity: 0.55, // make it visible
  },

  glare: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },

  iconBtn: {
    padding: 6,
    borderRadius: 999,
  },
});
