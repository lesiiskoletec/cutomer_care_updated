import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";

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

      {/* ✅ Number centered (no padding / no free space) */}
      <View pointerEvents="none" style={styles.ribbonNumberCenter}>
        <Text style={styles.ribbonNumber}>{number}</Text>
      </View>
    </View>
  );
}

export default function LMS() {
  const navigation = useNavigation();

  const grades = [
    { label: "Grade 1", color: "#F97316" },
    { label: "Grade 2", color: "#22C55E" },
    { label: "Grade 3", color: "#3B82F6" },
    { label: "Grade 4", color: "#A855F7" },
    { label: "Grade 5", color: "#EF4444" },
    { label: "Grade 6", color: "#14B8A6" },
    { label: "Grade 7", color: "#EAB308" },
    { label: "Grade 8", color: "#0EA5E9" },
    { label: "Grade 9", color: "#F43F5E" },
    { label: "Grade 10", color: "#6366F1" },
    { label: "Grade 11", color: "#10B981" },
    { label: "Grade 12", color: "#FB923C" },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.grid}>
        {grades.map((g, index) => {
          const num = String(index + 1).padStart(2, "0"); // ✅ 01..12

          return (
            <Pressable
              key={g.label}
              style={styles.card}
              onPress={() => navigation.navigate("Subjects", { grade: g.label })}
            >
              {/* ✅ Ribbon locked to top-left */}
              <View style={styles.ribbonCorner}>
                <RibbonV color={g.color} number={num} />
              </View>

              <Text style={styles.cardText}>{g.label}</Text>
            </Pressable>
          );
        })}
      </View>
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

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    height: 130,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",

    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    alignItems: "center",
    justifyContent: "center",
  },

  ribbonCorner: {
    position: "absolute",
    top: 0,
    left: 0,
  },

  /* ✅ Ribbon container */
  ribbonWrap: {
    width: 60,
    height: 47,
  },

  /* ✅ Number centered perfectly */
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
    fontSize: 16, // ✅ medium
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    marginLeft: -9,
  },

  cardText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
});
