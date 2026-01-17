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

export default function Sign({ navigation }) {
  const [mode, setMode] = useState("signup"); // "signup" | "signin"

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

  const isSignUp = mode === "signup";

  const onContinue = () => {
    if (isSignUp) {
      // ✅ Signup -> go OTP
      navigation.navigate("OTP", {
        phone: phone, // optional pass phone
        mode: "signup",
      });
      return;
    }

    // ✅ Signin -> (later connect API)
    console.log("Signin Continue");
  };

  const onBack = () => {
    if (navigation?.goBack) navigation.goBack();
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

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={lesiiskole_logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.welcome}>Welcome</Text>

        {/* ✅ Toggle container same as input background */}
        <View style={styles.toggleContainer}>
          <Pressable
            onPress={() => setMode("signup")}
            style={toggleBtnStyle(isSignUp)}
          >
            <Text style={toggleTextStyle(isSignUp)}>Sign Up</Text>
          </Pressable>

          <Pressable
            onPress={() => setMode("signin")}
            style={toggleBtnStyle(!isSignUp)}
          >
            <Text style={toggleTextStyle(!isSignUp)}>Sign In</Text>
          </Pressable>
        </View>

        {/* ✅ Forms */}
        <View style={styles.form}>
          {isSignUp ? (
            <>
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
                style={{ minHeight: 90, textAlignVertical: "top" }}
              />
              <Field
                placeholder="Password"
                value={passwordUp}
                onChangeText={setPasswordUp}
                secureTextEntry
              />
            </>
          ) : (
            <>
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

              <Pressable
                onPress={() => console.log("Forgot password")}
                style={styles.forgotWrap}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </>
          )}

          {/* ✅ Gradient Continue Button */}
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

          {/* Back button */}
          <Pressable onPress={onBack} style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Back</Text>
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
  page: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 28,
    alignItems: "center",
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },

  welcome: {
    fontSize: 26,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 14,
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

  toggleBtnActive: {
    backgroundColor: "#FFFFFF",
  },

  toggleBtnInactive: {
    backgroundColor: "transparent",
  },

  toggleText: {
    fontSize: 14,
    fontWeight: "500",
  },

  toggleTextActive: {
    color: PRIMARY,
  },

  toggleTextInactive: {
    color: "#64748B",
  },

  form: {
    width: "100%",
    gap: 10,
  },

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

  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: 2,
    marginBottom: 6,
  },

  forgotText: {
    color: PRIMARY,
    fontSize: 12,
    fontWeight: "700",
  },

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

  gradientBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  secondaryBtn: {
    width: "100%",
    height: 50,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8DEE8",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryBtnText: {
    color: PRIMARY,
    fontSize: 15,
    fontWeight: "500",
  },
});
