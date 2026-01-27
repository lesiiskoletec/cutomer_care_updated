import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Modal,
} from "react-native";
import {
  useFonts as useAlexandria,
  Alexandria_400Regular,
  Alexandria_700Bold,
} from "@expo-google-fonts/alexandria";

import { useUser } from "../context/UserContext";

import lesiiskole_logo from "../assets/lesiiskole_logo.png";
import alstudents from "../assets/alstudents.png";
import olstudents from "../assets/olstudents.png";
import primarylevel from "../assets/primarylevel.png";

export default function MainSelectgrade({ navigation }) {
  const { setUser } = useUser();

  const [fontsLoaded] = useAlexandria({
    Alexandria_400Regular,
    Alexandria_700Bold,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "primary" | "ol" | "al"

  const primaryGrades = useMemo(
    () => ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"],
    []
  );

  const olGrades = useMemo(
    () => ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11"],
    []
  );

  const alStreams = useMemo(
    () => ["Science Stream", "Maths Stream", "Tech", "Art", "Commerce"],
    []
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  const goHomeWithGrade = (level, grade) => {
    setUser((prev) => ({
      ...prev,
      level,
      grade,
      stream: null,
      enrolledSubjects: prev?.enrolledSubjects || [],
    }));
    closeModal();
    navigation.replace("Home");
  };

  const goHomeWithStream = (stream) => {
    setUser((prev) => ({
      ...prev,
      level: "al",
      grade: "Grade 12-13",
      stream,
      enrolledSubjects: [],
    }));
    closeModal();
    navigation.replace("Home");
  };

  const ModalContent = () => {
    if (modalType === "primary") {
      return (
        <>
          <Text style={styles.modalTitle}>Select Grade (1–5)</Text>
          {primaryGrades.map((g) => (
            <Pressable
              key={g}
              style={styles.modalItem}
              onPress={() => goHomeWithGrade("primary", g)}
            >
              <Text style={styles.modalItemText}>{g}</Text>
            </Pressable>
          ))}
        </>
      );
    }

    if (modalType === "ol") {
      return (
        <>
          <Text style={styles.modalTitle}>Select Grade (6–11)</Text>
          {olGrades.map((g) => (
            <Pressable
              key={g}
              style={styles.modalItem}
              onPress={() => goHomeWithGrade("ol", g)}
            >
              <Text style={styles.modalItemText}>{g}</Text>
            </Pressable>
          ))}
        </>
      );
    }

    if (modalType === "al") {
      return (
        <>
          <Text style={styles.modalTitle}>Select Stream (A/L)</Text>
          {alStreams.map((s) => (
            <Pressable
              key={s}
              style={styles.modalItem}
              onPress={() => goHomeWithStream(s)}
            >
              <Text style={styles.modalItemText}>{s}</Text>
            </Pressable>
          ))}
        </>
      );
    }

    return null;
  };

  const GradeCard = ({ img, title, subTitle, level }) => (
    <Pressable
      style={({ pressed }) => [styles.gradeCard, pressed && styles.pressed]}
      onPress={() => openModal(level)}
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
            level="primary"
          />
          <GradeCard
            img={olstudents}
            title="O/L Students"
            subTitle="Grade 6 to 11"
            level="ol"
          />
          <GradeCard
            img={alstudents}
            title="A/L Students"
            subTitle="Grade 12 to 13"
            level="al"
          />
        </View>
      </View>

      <Modal visible={modalOpen} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <ModalContent />
          </Pressable>
        </Pressable>
      </Modal>
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
  centerGroup: { alignItems: "center" },
  logo: { width: 150, height: 150, marginBottom: 8 },
  pageTitle: {
    fontFamily: "Alexandria_700Bold",
    fontSize: 30,
    color: "#214294",
    marginBottom: 25,
  },
  cardsWrap: { gap: 16, alignItems: "center" },

  gradeCard: {
    width: 353,
    height: 106,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 18,
    paddingRight: 14,
  },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.95 },
  cardImg: { width: 70, height: 70, marginRight: 14 },
  cardTextWrap: { flex: 1, justifyContent: "center", marginLeft: 10 },
  cardTitle: {
    fontFamily: "Alexandria_700Bold",
    fontSize: 13,
    color: "#0F172A",
  },
  cardSubTitle: {
    fontFamily: "Alexandria_400Regular",
    fontSize: 11,
    color: "#64748B",
    marginTop: 4,
  },
  arrowWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: { fontSize: 38, color: "#214294" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    marginBottom: 8,
  },
  modalItemText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#214294",
  },
});
