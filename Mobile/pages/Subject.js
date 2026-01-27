import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

/* 🔹 number → word */
const numberToWord = (num) => {
  const map = {
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine",
    10: "Ten",
    11: "Eleven",
  };
  return map[num] || String(num);
};

/* 🔹 Grade 4 → Grade Four */
const gradeToWordLabel = (gradeLabel) => {
  if (!gradeLabel) return "";
  const match = String(gradeLabel).match(/\d+/);
  const num = match ? parseInt(match[0], 10) : null;
  return num ? `Grade ${numberToWord(num)}` : gradeLabel;
};

export default function Subjects({ route }) {
  const navigation = useNavigation();
  const gradeLabel = route?.params?.grade || "Grade 4";

  const gradeNumber = useMemo(() => {
    const match = String(gradeLabel).match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }, [gradeLabel]);

  const gradeTitle = useMemo(
    () => gradeToWordLabel(gradeLabel),
    [gradeLabel]
  );

  /* ✅ SUBJECTS BASED ON GRADE */
  const subjects = useMemo(() => {
    if (!gradeNumber) return [];

    // Grade 1–5
    if (gradeNumber >= 1 && gradeNumber <= 5) {
      return [
        { key: "sinhala", label: "Sinhala" },
        { key: "parisaraya", label: "Parisaraya" },
        { key: "english", label: "English" },
        { key: "maths", label: "Maths" },
      ];
    }

    // Grade 6–11
    if (gradeNumber >= 6 && gradeNumber <= 11) {
      return [
        { key: "sinhala", label: "Sinhala" },
        { key: "mathematics", label: "Mathematics" },
        { key: "english", label: "English" },
        { key: "science", label: "Science" },
      ];
    }

    return [];
  }, [gradeNumber]);

  return (
    <View style={styles.screen}>
      {/* 🔹 Title */}
      <Text style={styles.pageTitle}>{gradeTitle}</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {subjects.map((item) => (
          <Pressable
            key={item.key}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              navigation.navigate("SubjectWithTeachers", {
                grade: gradeLabel,
                subject: item.label,
              })
            }
          >
            <Text style={styles.subjectText}>{item.label}</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#214294",
    textAlign: "center",
    marginBottom: 20,
  },

  pageSub: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 18,
  },

  list: {
    paddingBottom: 30,
    
  },

  card: {
    height: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    paddingHorizontal: 20,
    justifyContent: "center",

    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },

  subjectText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },

  arrow: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -18,
    fontSize: 38,
    color: "#214294",
  },
});
