import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Lessions({ route }) {
  const navigation = useNavigation();

  // (optional: coming from IndexNumber page)
  const indexNumber = route?.params?.indexNumber || "";
  const grade = route?.params?.grade || "";
  const subject = route?.params?.subject || "";
  const teacher = route?.params?.teacher || "";

  // ✅ Demo lesson data (later you can load from API)
  const lesson = {
    lessonNo: 1,
    title: "chakkre",
    date: "2025.8.12",
    time: "10.20 a.m",
    description:
      "fdv c cd sb rrfhb erfhfd hrhr hj\ngft gh jgt dtjg gdj gj ghjk u gfkyk kyud k sdrtk trsk",
    youtubeUrl: "https://youtu.be/30cffBrABao?si=a-IlPYIdH09g2XZa",
  };

  const onWatchNow = () => {
    navigation.navigate("ViewLesson", {
      lessonNo: lesson.lessonNo,
      title: lesson.title,
      date: lesson.date,
      time: lesson.time,
      description: lesson.description,
      youtubeUrl: lesson.youtubeUrl,

      // (optional pass-through)
      indexNumber,
      grade,
      subject,
      teacher,
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* ===== Lesson Card ===== */}
      <View style={styles.card}>
        <Text style={styles.lessonNo}>Lesson {lesson.lessonNo}</Text>

        <Text style={styles.title}>Title : {lesson.title}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Date : {lesson.date}</Text>
          <Text style={styles.metaText}>Time : {lesson.time}</Text>
        </View>

        <Text style={styles.desc}>description: {lesson.description}</Text>

        <View style={styles.bottomRow}>
          <Pressable style={styles.watchBtn} onPress={onWatchNow}>
            <Text style={styles.watchText}>Watch Now</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 16, paddingBottom: 120 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  lessonNo: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "900",
    color: "#1F5EEB",
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 10,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  metaText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#475569",
  },

  desc: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 20,
  },

  bottomRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  watchBtn: {
    backgroundColor: "#1F5EEB",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  watchText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
});
