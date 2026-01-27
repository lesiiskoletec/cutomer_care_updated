import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import { Ionicons } from "@expo/vector-icons";

const numberFromGrade = (gradeLabel) => {
  if (!gradeLabel) return null;
  const match = String(gradeLabel).match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

const gradeWord = (n) => {
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
  return map[n] || String(n);
};

export default function EnrollSubjects() {
  const navigation = useNavigation();
  const { user, setUser } = useUser();
  const [modalOpen, setModalOpen] = useState(false);

  const level = user?.level; // "primary" | "ol" | "al"
  const stream = user?.stream; // for AL
  const gradeNo = useMemo(() => numberFromGrade(user?.grade), [user?.grade]);

  // ✅ STREAM SUBJECTS (A/L)
  const alSubjectsByStream = useMemo(
    () => ({
      "Science Stream": [
        { key: "physics", label: "Physics" },
        { key: "chemistry", label: "Chemistry" },
        { key: "biology", label: "Biology" },
      ],
      "Maths Stream": [
        { key: "combined_maths", label: "Combined Maths" },
        { key: "physics", label: "Physics" },
        { key: "chemistry", label: "Chemistry" },
        { key: "ict", label: "ICT" },
      ],
      Tech: [
        { key: "engineering_tech", label: "Engineering Technology" },
        { key: "science_for_tech", label: "Science for Technology" },
        { key: "ict", label: "ICT" },
      ],
      Commerce: [
        { key: "accounting", label: "Accounting" },
        { key: "business_studies", label: "Business Studies" },
        { key: "economics", label: "Economics" },
      ],
      Art: [
        { key: "logic", label: "Logic & Scientific Method" },
        { key: "media", label: "Media Studies" },
        { key: "art", label: "Art" },
      ],
    }),
    []
  );

  // ✅ SUBJECT LIST
  const subjects = useMemo(() => {
    if (level === "al") {
      if (!stream) return [];
      return alSubjectsByStream[stream] || [];
    }

    if (!gradeNo) return [];

    if (gradeNo >= 1 && gradeNo <= 5) {
      return [
        { key: "sinhala", label: "Sinhala" },
        { key: "parisaraya", label: "Parisaraya" },
        { key: "english", label: "English" },
        { key: "maths", label: "Maths" },
      ];
    }

    if (gradeNo >= 6 && gradeNo <= 11) {
      return [
        { key: "sinhala", label: "Sinhala" },
        { key: "english", label: "English" },
        { key: "science", label: "Science" },
        { key: "maths", label: "Maths" },
      ];
    }

    return [];
  }, [level, stream, alSubjectsByStream, gradeNo]);

  const pageTitle = useMemo(() => {
    if (level === "al") return stream ? `${stream}` : "Select Stream";
    if (!gradeNo) return "Select Grade";
    return `Grade ${gradeWord(gradeNo)}`;
  }, [level, stream, gradeNo]);

  // ✅ Unlock rules (same as before)
  const isUnlocked = (key) => {
    if (level === "al") return true; // A/L: all unlocked (free trial)
    return key === "maths"; // Primary/O-L: only maths
  };

  const ensureEnrolled = (key) => {
    setUser((prev) => {
      const current = prev?.enrolledSubjects || [];
      if (current.includes(key)) return prev;
      return { ...prev, enrolledSubjects: [...current, key] };
    });
  };

  const onPressSubject = (item) => {
    const locked = !isUnlocked(item.key);
    if (locked) {
      setModalOpen(true);
      return;
    }

    ensureEnrolled(item.key);

    navigation.navigate("SubjectWithTeachers", {
      grade: user?.grade,
      subject: item.label,
      stream: user?.stream,
      level: user?.level,
    });
  };

  // ✅ AL but stream not selected
  if (level === "al" && !stream) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>No Stream Selected</Text>
        <Text style={styles.sub}>Please select your stream first.</Text>

        <Pressable
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("MainSelectgrade")}
        >
          <Text style={styles.primaryBtnText}>Go to Stream Selection</Text>
        </Pressable>
      </View>
    );
  }

  // ✅ Non-AL but no grade
  if (level !== "al" && !user?.grade) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>No Grade Selected</Text>
        <Text style={styles.sub}>Please select your grade first.</Text>

        <Pressable
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("MainSelectgrade")}
        >
          <Text style={styles.primaryBtnText}>Go to Grade Selection</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.pageTitle}>{pageTitle}</Text>
      <Text style={styles.pageSub}>Enroll Subjects</Text>

      {subjects.map((s) => {
        const locked = !isUnlocked(s.key);

        return (
          <Pressable
            key={s.key}
            onPress={() => onPressSubject(s)}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.pressed,
              locked && styles.cardLocked,
            ]}
          >
            <View style={styles.left}>
              <Text style={styles.cardTitle}>{s.label}</Text>

              {locked ? (
                <Text style={styles.cardSub}>Locked</Text>
              ) : (
                <Text style={styles.cardSubOk}>Available</Text>
              )}
            </View>

            {/* ✅ ALWAYS BLUE VIEW ICON */}
            <View style={styles.right}>
              <Ionicons name="eye-outline" size={22} color="#214294" />
            </View>
          </Pressable>
        );
      })}

      {/* ✅ 7 Day Free Trial label (ONLY for A/L) */}
      {level === "al" && (
        <View style={styles.trialWrap}>
          <Text style={styles.trialText}>🎁 7 Day Free Trial</Text>
          <Text style={styles.trialSub}>All subjects are unlocked for 7 days.</Text>
        </View>
      )}

      {/* Locked Modal */}
      <Modal visible={modalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Not Available</Text>
            <Text style={styles.modalText}>This subject is locked right now.</Text>

            <TouchableOpacity
              onPress={() => setModalOpen(false)}
              style={styles.modalBtn}
              activeOpacity={0.9}
            >
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
    paddingTop: 22,
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#214294",
    textAlign: "center",
  },

  pageSub: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 4,
  },

  cardLocked: { opacity: 0.6 },
  pressed: { transform: [{ scale: 0.99 }] },

  left: { flex: 1 },

  cardTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
  },

  cardSub: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "800",
    color: "#EF4444",
  },

  cardSubOk: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "800",
    color: "#10B981",
  },

  right: { width: 40, alignItems: "flex-end" },

  trialWrap: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    padding: 12,
    alignItems: "center",
  },
  trialText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#214294",
  },
  trialSub: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },

  modalCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },

  modalText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },

  modalBtn: {
    marginTop: 14,
    backgroundColor: "#214294",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  modalBtnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },

  center: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  title: { fontSize: 18, fontWeight: "900", color: "#0F172A" },

  sub: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
  },

  primaryBtn: {
    marginTop: 14,
    backgroundColor: "#214294",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },

  primaryBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 },
});
