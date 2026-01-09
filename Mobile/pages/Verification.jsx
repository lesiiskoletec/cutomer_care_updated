// pages/Verification.js
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

// Fonts
import {
  useFonts as useKavoon,
  Kavoon_400Regular,
} from "@expo-google-fonts/kavoon";
import {
  useFonts as useItim,
  Itim_400Regular,
} from "@expo-google-fonts/itim";
import {
  useFonts as useRavi,
  RaviPrakash_400Regular,
} from "@expo-google-fonts/ravi-prakash";

import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../app/features/authslice";

const PRIMARY = "#3E28FF";
const BG = "#EBEBEB";

export default function Verification({ navigation }) {
  const [kavoonLoaded] = useKavoon({ Kavoon_400Regular });
  const [itimLoaded] = useItim({ Itim_400Regular });
  const [raviLoaded] = useRavi({ RaviPrakash_400Regular });

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = Array.from({ length: 6 }, () => useRef(null));

  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const pendingPhone = useSelector((state) => state.auth.pendingPhone);

  if (!(kavoonLoaded && itimLoaded && raviLoaded)) return null;

  const handleChange = (text, index) => {
    if (text.length > 1) return;
    const digit = text.replace(/\D/g, "");
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < 5 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join("");

    if (!fullCode || fullCode.length !== 6) {
      Alert.alert("Error", "Please enter the 6-digit verification code.");
      return;
    }

    if (!pendingPhone) {
      Alert.alert("Error", "Phone number not found. Please Sign Up again.");
      navigation.replace("SignUp");
      return;
    }

    try {
      // 🔹 Call backend -> /api/auth/whatsapp/verify-code
      await dispatch(
        verifyOtp({
          phonenumber: pendingPhone,
          code: fullCode,
        })
      ).unwrap();

      // ✅ Only on success -> go to SignIn
      navigation.replace("SignIn");
    } catch (err) {
      Alert.alert("Verification Failed", err || "Invalid or expired code");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Verification</Text>

      {pendingPhone && (
        <Text style={styles.subText}>
          Code sent to{" "}
          <Text style={{ fontWeight: "bold" }}>{pendingPhone}</Text>
        </Text>
      )}

      <View style={styles.codeRow}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={inputRefs[index]}
            style={styles.codeInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={authStatus === "loading"}
      >
        <Text style={styles.buttonText}>
          {authStatus === "loading" ? "Verifying..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  mainText: {
    fontFamily: "Kavoon_400Regular",
    fontSize: 34,
    color: PRIMARY,
    marginBottom: 10,
    textAlign: "center",
  },
  subText: {
    fontFamily: "Itim_400Regular",
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 30,
  },
  codeInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 16,
    textAlign: "center",
    fontSize: 18,
    color: PRIMARY,
    backgroundColor: "#FFFFFF",
    fontFamily: "Itim_400Regular",
  },
  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 35,
    borderRadius: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 22,
    letterSpacing: 0.5,
    fontFamily: "RaviPrakash_400Regular",
  },
});
