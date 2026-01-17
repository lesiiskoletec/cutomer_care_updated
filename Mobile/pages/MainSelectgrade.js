import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";

import {
  useFonts as useAlexandria,
  Alexandria_400Regular,
  Alexandria_700Bold,
} from "@expo-google-fonts/alexandria";

import lesiiskole_logo from "../assets/lesiiskole_logo.png";
import alstudents from "../assets/alstudents.png";
import olstudents from "../assets/olstudents.png";
import primarylevel from "../assets/primarylevel.png";

export default function MainSelectgrade({ navigation }) {
  const [fontsLoaded] = useAlexandria({
    Alexandria_400Regular,
    Alexandria_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const GradeCard = ({ img, title, subTitle, gradeKey }) => (
    <Pressable
      style={styles.gradeCard}
      onPress={() => navigation.navigate("Sign", { grade: gradeKey })}
    >
      <Image source={img} style={styles.cardImg} resizeMode="contain" />

      <View style={styles.cardTextWrap}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubTitle}>{subTitle}</Text>
      </View>

      <View style={styles.arrowWrap}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.centerGroup}>
        <Image source={lesiiskole_logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.pageTitle}>Select your grade</Text>

        <View style={styles.cardsWrap}>
          <GradeCard
            img={primarylevel}
            title="Primary Level"
            subTitle="Grade 1 to 5"
            gradeKey="primary"
          />
          <GradeCard
            img={olstudents}
            title="O/L Students"
            subTitle="Grade 6 to 11"
            gradeKey="ol"
          />
          <GradeCard
            img={alstudents}
            title="A/L Students"
            subTitle="Grade 12 to 13"
            gradeKey="al"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderWrap: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  centerGroup: {
    alignItems: "center",
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: 8,
  },

  pageTitle: {
    fontFamily: "Alexandria_700Bold",
    fontSize: 30,
    color: "#214294",
    marginBottom: 25,
  },

  cardsWrap: {
    gap: 16,
    alignItems: "center",
    marginLeft: 5,
  },

  gradeCard: {
    width: 353,
    height: 106,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 18,
    paddingRight: 14,
  },

  cardImg: {
    width: 70,
    height: 70,
    marginRight: 14,
  },

  cardTextWrap: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 15,
  },

  cardTitle: {
    fontFamily: "Alexandria_700Bold",
    fontSize: 12,
    color: "#000000ff",
  },

  cardSubTitle: {
    fontFamily: "Alexandria_400Regular",
    fontSize: 10,
    color: "#8A8A8A",
    marginTop: 4,
  },

  arrowWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  arrowText: {
    fontSize: 40,
    color: "#214294",
    marginTop: -2,
  },
});
