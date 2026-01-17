import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import charithsir from "../assets/charirithsir.png";

export default function SubjectWithTeachers({ route }) {
  const navigation = useNavigation();

  const grade = route?.params?.grade || "Grade Five";
  const subject = route?.params?.subject || "Maths";

  const goIndexNumber = () => {
    navigation.navigate("IndexNumber", {
      grade,
      subject,
      teacher: "Charith Sir",
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {/* 🔒 Lock (TOP RIGHT) */}
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed" size={14} color="#0F172A" />
        </View>

        {/* 🏷️ Offer (below lock, right side) */}
        <View style={styles.offerBadge}>
          <Text style={styles.offerText}>Offer</Text>
          <Text style={styles.offerPct}>10%</Text>
        </View>

        {/* Teacher image */}
        <Image source={charithsir} style={styles.teacherImg} resizeMode="cover" />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.grade}>{grade}</Text>
          <Text style={styles.subject}>Subject - {subject}</Text>
          <Text style={styles.teacher}>Teacher - Charith Sir</Text>

          <View style={styles.bottomRow}>
            {/* ✅ Navigate to IndexNumber */}
            <Pressable style={styles.enrollBtn} onPress={goIndexNumber}>
              <Text style={styles.enrollText}>Enroll Now</Text>
            </Pressable>
          </View>
        </View>
      </View>
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
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",

    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  lockBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,

    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  offerBadge: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "#E9F2FF",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
  },

  offerText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1F5EEB",
    lineHeight: 12,
  },

  offerPct: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1F5EEB",
    marginTop: 1,
  },

  teacherImg: {
    width: 82,
    height: 95,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: "#EEF2FF",
  },

  content: {
    flex: 1,
  },

  grade: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 4,
  },

  subject: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F5EEB",
    marginBottom: 4,
  },

  teacher: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },

  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  enrollBtn: {
    backgroundColor: "#1F5EEB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },

  enrollText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
});
