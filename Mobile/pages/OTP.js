import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const BG_INPUT = "#F1F5F9";
const PLACEHOLDER = "#97A4B8";
const PRIMARY = "#214294";

export default function OTP({ navigation, route }) {
  const phone = route?.params?.phone || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const onChangeDigit = (text, index) => {
    const digit = (text || "").replace(/[^0-9]/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const onKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      const next = [...otp];

      if (!otp[index] && index > 0) {
        next[index - 1] = "";
        setOtp(next);
        inputsRef.current[index - 1]?.focus();
      } else {
        next[index] = "";
        setOtp(next);
      }
    }
  };

  const onVerify = () => {
    console.log("VERIFY CLICKED ✅"); // <--- confirm button press

    const code = otp.join("");
    console.log("OTP CODE:", code);

    if (code.length !== 6) {
      Alert.alert("OTP Error", "Please enter the full 6-digit OTP.");
      return;
    }

    // ✅ navigate to Home (most reliable)
    navigation.replace("Home");
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subTitle}>
          Enter the 6-digit code we sent{phone ? ` to ${phone}` : ""}.
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(r) => (inputsRef.current[idx] = r)}
              value={digit}
              onChangeText={(t) => onChangeDigit(t, idx)}
              onKeyPress={(e) => onKeyPress(e, idx)}
              keyboardType="number-pad"
              placeholder="•"
              placeholderTextColor={PLACEHOLDER}
              maxLength={1}
              style={styles.otpBox}
            />
          ))}
        </View>

        <Pressable onPress={onVerify} style={styles.gradientBtnOuter}>
          <LinearGradient
            colors={["#086DFF", "#5E9FFD", "#7DB1FC", "#62C4F6", "#48D7F0", "#C7F4F8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBtn}
          >
            <Text style={styles.gradientBtnText}>Verify</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, paddingHorizontal: 18, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "800", color: PRIMARY },
  subTitle: { marginTop: 8, fontSize: 12, fontWeight: "600", color: "#64748B", textAlign: "center", marginBottom: 18 },
  otpRow: { flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 18 },
  otpBox: {
    width: 44,
    height: 50,
    borderRadius: 12,
    backgroundColor: BG_INPUT,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    includeFontPadding: false,
    paddingVertical: 0,
  },
  gradientBtnOuter: { width: "100%", borderRadius: 16, overflow: "hidden", marginTop: 6 },
  gradientBtn: { height: 50, alignItems: "center", justifyContent: "center", borderRadius: 16 },
  gradientBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
});
