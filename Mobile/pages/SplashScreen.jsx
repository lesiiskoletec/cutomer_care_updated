import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import {
  useFonts,
  RacingSansOne_400Regular,
} from "@expo-google-fonts/racing-sans-one";

import splash from "../assets/splash.png";
import lesiiskole_logo from "../assets/lesiiskole_logo.png";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({ RacingSansOne_400Regular });

  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace("SignUp");
    }, 3500);
    return () => clearTimeout(t);
  }, [navigation]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* TITLE */}
      <View style={styles.titleWrapper}>
        <Text style={styles.mainTitle}>Customer</Text>
        <Text style={styles.subTitle}>Care</Text>
      </View>

      {/* CENTERED IMAGE */}
      <View style={styles.imageWrapper}>
        <Image
          source={splash}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.poweredText}>Powered by</Text>
        <Image
          source={lesiiskole_logo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBEBEB",
    alignItems: "center",
  },

  // TITLE AT TOP WITH GOOD SPACING
  titleWrapper: {
    alignItems: "center",
    marginTop: 60, // ⬅ push text down slightly from very top
  },

  mainTitle: {
    fontFamily: "RacingSansOne_400Regular",
    fontSize: 55,
    fontWeight: "bold",
    color: "#1F31F9",
  },

  subTitle: {
    fontFamily: "RacingSansOne_400Regular",
    fontSize: 55,
    fontWeight: "bold",
    color: "#1F31F9",
    marginTop: -10,
  },

  // IMAGE CENTERED PERFECTLY
  imageWrapper: {
    flex: 1, // ⬅ makes image take center space
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: -180, // ⬅ adjust to fine-tune vertical position  
  },

  splashImage: {
    width: width * 1.2,     // ⬅ original size
    height: height * 1.3,   // ⬅ original size
  },

  footer: {
    position: "absolute",
    bottom: 35,
    right: 25,
    alignItems: "center",
  },

  poweredText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "#1F31F9",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 6,
  },

  logo: {
    width: 100,
    height: 40,
  },
});

export default SplashScreen;
