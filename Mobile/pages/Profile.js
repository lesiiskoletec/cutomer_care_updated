import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import profile from "../assets/profile.png";
import ReviewComponent from "../components/ReviewComponent";

// ✅ match your BottomNavigation height
const TAB_BAR_HEIGHT = 90;

export default function Profile({ route }) {
  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.container}>
            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              <Image source={profile} style={styles.avatar} />
            </View>

            {/* Details Card */}
            <View style={styles.detailsCard}>
              {/* Row 1: Name + Grade */}
              <View style={styles.twoColRow}>
                <View style={styles.leftCol}>
                  <Text>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}> Charuka</Text>
                  </Text>
                </View>

                <View style={styles.rightCol}>
                  <Text>
                    <Text style={styles.label}>Grade:</Text>
                    <Text style={styles.value}> 10</Text>
                  </Text>
                </View>
              </View>

              {/* Row 2: Address + Town */}
              <View style={[styles.twoColRow, { marginTop: 5 }]}>
                <View style={styles.leftCol}>
                  <Text>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}> Baduwaththa,</Text>
                  </Text>
                  <Text style={styles.value}>Ehiliyagoda</Text>
                </View>

                <View style={styles.rightCol}>
                  <Text>
                    <Text style={styles.label}>Town:</Text>
                    <Text style={styles.value}> Ehiliyagoda</Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* ✅ ReviewComponent card */}
            <ReviewComponent route={route} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  // ✅ prevent bottom nav overlay
  content: {
    paddingBottom: TAB_BAR_HEIGHT + 10,
  },

  container: {
    alignItems: "center",
    paddingTop: 10,
  },

  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
   marginBottom: 5,
  },

  avatar: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },

  detailsCard: {
    width: "90%",
    backgroundColor: "#D9D9D9",
    borderRadius: 16,
    padding: 16,
  },

  twoColRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  leftCol: { width: "58%" },

  rightCol: {
    width: "38%",
    alignItems: "flex-start",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  value: {
    fontSize: 14,
    color: "#0F172A",
  },
});
