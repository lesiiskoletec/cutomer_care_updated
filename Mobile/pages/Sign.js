import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import lesiiskole_logo from "../assets/lesiiskole_logo.png";

const BG_INPUT = "#F1F5F9";
const PLACEHOLDER = "#97A4B8";
const PRIMARY = "#214294";

export default function Sign({ navigation, route }) {
  const [mode, setMode] = useState("signup"); // "signup" | "signin"
  const isSignUp = mode === "signup";

  const level = route?.params?.level || "";

  // Signup fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [town, setTown] = useState("");
  const [address, setAddress] = useState("");
  const [passwordUp, setPasswordUp] = useState("");

  // Signin fields
  const [phoneIn, setPhoneIn] = useState("");
  const [passwordIn, setPasswordIn] = useState("");

  const onContinue = () => {
    if (isSignUp) {
      const safePhone = phone?.trim() || "0770000000";
      navigation.navigate("OTP", { phone: safePhone, mode: "signup", level });
      return;
    }
    navigation.replace("MainSelectgrade");
  };

  const toggleBtnStyle = useMemo(
    () => (active) => [
      styles.toggleBtn,
      active ? styles.toggleBtnActive : styles.toggleBtnInactive,
    ],
    []
  );

  const toggleTextStyle = useMemo(
    () => (active) => [
      styles.toggleText,
      active ? styles.toggleTextActive : styles.toggleTextInactive,
    ],
    []
  );

  // ✅ SIGNIN = centered screen (no scroll)
  if (!isSignUp) {
    return (
      <KeyboardAvoidingView
        style={styles.page}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.centerSignin}>
          <Image source={lesiiskole_logo} style={styles.logoSmall} resizeMode="contain" />
          <Text style={styles.welcome}>Welcome</Text>

          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <Pressable onPress={() => setMode("signup")} style={toggleBtnStyle(false)}>
              <Text style={toggleTextStyle(false)}>Sign Up</Text>
            </Pressable>

            <Pressable onPress={() => setMode("signin")} style={toggleBtnStyle(true)}>
              <Text style={toggleTextStyle(true)}>Sign In</Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            <Field
              placeholder="Phone Number"
              value={phoneIn}
              onChangeText={setPhoneIn}
              keyboardType="phone-pad"
            />
            <Field
              placeholder="Password"
              value={passwordIn}
              onChangeText={setPasswordIn}
              secureTextEntry
            />

            <Pressable onPress={() => {}} style={styles.forgotWrap}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            <Pressable onPress={onContinue} style={styles.gradientBtnOuter}>
              <LinearGradient
                colors={["#086DFF", "#5E9FFD", "#7DB1FC", "#62C4F6", "#48D7F0", "#C7F4F8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.gradientBtnText}>Continue</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ✅ SIGNUP = scroll (long form)
  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={lesiiskole_logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.welcome}>Welcome</Text>

        {/* Toggle */}
        <View style={styles.toggleContainer}>
          <Pressable onPress={() => setMode("signup")} style={toggleBtnStyle(true)}>
            <Text style={toggleTextStyle(true)}>Sign Up</Text>
          </Pressable>

          <Pressable onPress={() => setMode("signin")} style={toggleBtnStyle(false)}>
            <Text style={toggleTextStyle(false)}>Sign In</Text>
          </Pressable>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Field placeholder="Name" value={name} onChangeText={setName} />
          <Field
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Field placeholder="District" value={district} onChangeText={setDistrict} />
          <Field placeholder="Town" value={town} onChangeText={setTown} />
          <Field
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
            style={{ minHeight: 90, textAlignVertical: "top", paddingTop: 12 }}
          />
          <Field
            placeholder="Password"
            value={passwordUp}
            onChangeText={setPasswordUp}
            secureTextEntry
          />

          <Pressable onPress={onContinue} style={styles.gradientBtnOuter}>
            <LinearGradient
              colors={["#086DFF", "#5E9FFD", "#7DB1FC", "#62C4F6", "#48D7F0", "#C7F4F8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBtn}
            >
              <Text style={styles.gradientBtnText}>Continue</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
  autoCapitalize,
  multiline,
  style,
}) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={PLACEHOLDER}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      style={[styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFFFFF" },

  container: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
    alignItems: "center",
  },

  // ✅ Signup logo
  logo: { width: 140, height: 140, marginBottom: 4 },

  // ✅ Signin logo smaller
  logoSmall: { width: 120, height: 120, marginBottom: 20 },

  // ✅ Signin Center Wrapper
  centerSignin: {
    flex: 1,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  welcome: {
    fontSize: 26,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 12,
    marginTop: -25,
  },

  toggleContainer: {
    width: "100%",
    backgroundColor: BG_INPUT,
    borderRadius: 16,
    padding: 6,
    flexDirection: "row",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 18,
  },

  toggleBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleBtnActive: { backgroundColor: "#FFFFFF" },
  toggleBtnInactive: { backgroundColor: "transparent" },

  toggleText: { fontSize: 14, fontWeight: "500" },
  toggleTextActive: { color: PRIMARY },
  toggleTextInactive: { color: "#64748B" },

  form: { width: "100%", gap: 10 },

  input: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    backgroundColor: BG_INPUT,
    paddingHorizontal: 14,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  forgotWrap: { alignSelf: "flex-end", marginTop: 2, marginBottom: 6 },
  forgotText: { color: PRIMARY, fontSize: 12, fontWeight: "700" },

  gradientBtnOuter: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 6,
  },
  gradientBtn: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  gradientBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
});
