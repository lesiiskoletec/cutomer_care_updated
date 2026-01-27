import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";

import { useUser } from "../context/UserContext";

/* ✅ Ribbon with centered number */
function RibbonV({ color = "#F97316", number = "01" }) {
  return (
    <View style={styles.ribbonWrap}>
      <Svg width={60} height={47} viewBox="0 0 60 47">
        <Path
          d="
            M0 0
            H60
            L46 23.5
            L60 47
            H0
            Z
          "
          fill={color}
        />
      </Svg>

      <View pointerEvents="none" style={styles.ribbonNumberCenter}>
        <Text style={styles.ribbonNumber}>{number}</Text>
      </View>
    </View>
  );
}

export default function LMS() {
  const navigation = useNavigation();
  const { user } = useUser();

  const gradeLabel = user?.grade; // e.g. "Grade 1"
  const level = user?.level; // "primary" | "ol" | "al"

  // ✅ LMS not allowed for AL
  if (level === "al") {
    return (
      <View style={styles.center}>
        <Text style={styles.centerTitle}>LMS Not Available</Text>
        <Text style={styles.centerDesc}>LMS is available for Primary and O/L only.</Text>
      </View>
    );
  }

  // ✅ If grade not selected yet
  if (!gradeLabel) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerTitle}>No Grade Selected</Text>
        <Text style={styles.centerDesc}>Please select your grade first.</Text>

        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.replace("MainSelectgrade")}
        >
          <Text style={styles.backBtnText}>Go to Grade Selection</Text>
        </Pressable>
      </View>
    );
  }

  // ✅ get grade number (1..11)
  const gradeNumber = useMemo(() => {
    const match = gradeLabel.match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
  }, [gradeLabel]);

  // ✅ Grade number -> words
  const gradeWord = useMemo(() => {
    const words = {
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
    return words[gradeNumber] || String(gradeNumber);
  }, [gradeNumber]);

  const fullGradeText = `Grade ${gradeWord}`;

  // ✅ color map
  const gradeColor = useMemo(() => {
    const colorMap = {
      1: "#F97316",
      2: "#22C55E",
      3: "#3B82F6",
      4: "#A855F7",
      5: "#EF4444",
      6: "#14B8A6",
      7: "#EAB308",
      8: "#0EA5E9",
      9: "#F43F5E",
      10: "#6366F1",
      11: "#10B981",
    };
    return colorMap[gradeNumber] || "#3B82F6";
  }, [gradeNumber]);

  const numberText = String(gradeNumber).padStart(2, "0");

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable
        style={styles.fullCard}
        onPress={() => navigation.navigate("Subjects", { grade: gradeLabel })}
      >
        {/* ✅ Ribbon top-left */}
        <View style={styles.ribbonCorner}>
          <RibbonV color={gradeColor} number={numberText} />
        </View>

        {/* ✅ PERFECT CARD CENTER (absolute) */}
        <View pointerEvents="none" style={styles.absoluteCenter}>
          <Text style={styles.cardText}>{fullGradeText}</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 140,
  },

  fullCard: {
    width: "100%",
    minHeight: 90,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",

    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    position: "relative", // ✅ needed for absolute center
  },

  ribbonCorner: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 5,
  },

  // ✅ TRUE CENTER (doesn't move due to ribbon/padding)
  absoluteCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  cardText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },

  /* Ribbon */
  ribbonWrap: {
    width: 60,
    height: 47,
  },

  ribbonNumberCenter: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 60,
    height: 47,
    alignItems: "center",
    justifyContent: "center",
  },

  ribbonNumber: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    marginLeft: -9,
  },

  /* fallback screens */
  center: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  centerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
  },

  centerDesc: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
  },

  backBtn: {
    marginTop: 14,
    backgroundColor: "#214294",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
});
