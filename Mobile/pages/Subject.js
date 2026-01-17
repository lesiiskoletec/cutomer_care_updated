import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import gradefivesinhala from "../assets/gradefivesinhala.png";

export default function Subjects({ route }) {
  const navigation = useNavigation();
  const grade = route?.params?.grade || "Grade Five";

  return (
    <View style={styles.screen}>
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate("SubjectWithTeachers", {
            grade,
            subject: "Maths",
          })
        }
      >
        <Image source={gradefivesinhala} style={styles.image} resizeMode="contain" />

        <View style={styles.content}>
          <Text style={styles.grade}>{grade}</Text>
          <Text style={styles.subject}>Subject - Mathematics</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,

    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  image: {
    width: 70,
    height: 70,
    marginRight: 14,
  },

  content: { flex: 1 },

  grade: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 2,
  },

  subject: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F5EEB",
    marginBottom: 2,
  },
});
