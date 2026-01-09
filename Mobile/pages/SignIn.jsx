// pages/SignIn.js
import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

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
import { loginUser } from "../app/features/authslice";

const PRIMARY = "#3E28FF";
const BG = "#EBEBEB";

const SignIn = ({ navigation }) => {
  const [fontsLoaded] = useKavoon({ Kavoon_400Regular });
  const [itimLoaded] = useItim({ Itim_400Regular });
  const [raviLoaded] = useRavi({ RaviPrakash_400Regular });

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);

  if (!(fontsLoaded && itimLoaded && raviLoaded)) return null;

  const onSubmit = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    try {
      // 🔹 Call backend -> /api/auth/signin
      await dispatch(loginUser({ phone, password })).unwrap();

      // ✅ Only on success -> go to Home
      navigation.replace("Home");
    } catch (err) {
      Alert.alert("Login Failed", err || "Invalid credentials");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BG }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Sign In</Text>

        <Text style={styles.label}>Phone number</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="07XXXXXXXX"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
        />

        <Pressable
          style={styles.button}
          onPress={onSubmit}
          disabled={authStatus === "loading"}
        >
          <Text style={styles.buttonText}>
            {authStatus === "loading" ? "Please wait..." : "Sign In"}
          </Text>
        </Pressable>

        {/* 🔹 Don't have account? Link to SignUp */}
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Don&apos;t have an account? </Text>
          <Pressable onPress={() => navigation.replace("SignUp")}>
            <Text style={styles.bottomLink}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontFamily: "Kavoon_400Regular",
    fontSize: 52,
    color: PRIMARY,
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontFamily: "Itim_400Regular",
    fontSize: 18,
    color: "#000",
    marginBottom: 3,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DDD",
    width: "100%",
    marginBottom: 8,
  },
  button: {
    backgroundColor: PRIMARY,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 35,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  buttonText: {
    fontFamily: "RaviPrakash_400Regular",
    color: "#FFFFFF",
    fontSize: 22,
    letterSpacing: 0.3,
  },
  bottomRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  bottomText: {
    fontFamily: "Itim_400Regular",
    fontSize: 14,
    color: "#333",
  },
  bottomLink: {
    fontFamily: "Itim_400Regular",
    fontSize: 14,
    color: PRIMARY,
    textDecorationLine: "underline",
  },
});

export default SignIn;
