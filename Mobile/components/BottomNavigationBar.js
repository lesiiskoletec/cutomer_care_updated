import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const LMS_SIZE = 90;
const BAR_RADIUS = 24;
const BAR_HEIGHT = 64;

export default function BottomNavigationBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      {/* Bottom Bar */}
      <View style={styles.shadowContainer}>
        <View style={styles.bar}>
          <NavItem iconName="home-outline" label="Home" onPress={() => navigation.navigate("Home")} />
          <NavItem iconName="radio-outline" label="Live" onPress={() => navigation.navigate("Live")} />

          <View style={styles.slotCenter} />

          <NavItem iconName="stats-chart-outline" label="Result" onPress={() => navigation.navigate("Result")} />
          <NavItem iconName="person-outline" label="Profile" onPress={() => navigation.navigate("Profile")} />
        </View>
      </View>

      {/* Floating LMS Button */}
      <Pressable
        onPress={() => navigation.navigate("LMS")}
        style={({ pressed }) => [styles.centerButton, pressed && styles.centerPressed]}
        android_ripple={{ color: "rgba(0,0,0,0.08)", borderless: true }}
      >
        <Ionicons name="school-outline" size={34} color="#0a1badff" />
        <Text style={styles.centerLabel}>LMS</Text>
      </Pressable>
    </View>
  );
}

function NavItem({ iconName, label, onPress }) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <Ionicons name={iconName} size={26} color="#0a1badff" />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // ✅ absolute overlay – NO background, NO padding color
  root: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  shadowContainer: {
    width: "100%",
    borderRadius: BAR_RADIUS,
    elevation: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },

  bar: {
    height: BAR_HEIGHT,
    backgroundColor: "#FFFFFF",
    borderRadius: BAR_RADIUS,
    flexDirection: "row",
    alignItems: "center",
  },

  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  slotCenter: {
    width: LMS_SIZE,
  },

  text: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
    color: "#0a1badff",
  },

  centerButton: {
    position: "absolute",
    top: -LMS_SIZE / 2 + 12,
    width: LMS_SIZE,
    height: LMS_SIZE,
    borderRadius: LMS_SIZE / 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",

    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  centerPressed: {
    opacity: Platform.OS === "ios" ? 0.85 : 1,
  },

  centerLabel: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "900",
    color: "#0a1badff",
  },
});
