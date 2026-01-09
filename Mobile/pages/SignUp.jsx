// pages/SignUp.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  useFonts as useSuezOne,
  SuezOne_400Regular,
} from "@expo-google-fonts/suez-one";
import {
  useFonts as useRavi,
  RaviPrakash_400Regular,
} from "@expo-google-fonts/ravi-prakash";

import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../app/features/authslice";

const PRIMARY = "#3E28FF";
const BG = "#EBEBEB";

const Radio = ({ selected, onPress, label }) => {
  return (
    <Pressable style={styles.radioItem} onPress={onPress}>
      <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </Pressable>
  );
};

const SignUp = ({ navigation }) => {
  const [fontsLoaded] = useKavoon({ Kavoon_400Regular });
  const [itimLoaded] = useItim({ Itim_400Regular });
  const [suezLoaded] = useSuezOne({ SuezOne_400Regular });
  const [raviLoaded] = useRavi({ RaviPrakash_400Regular });

  const [name, setName] = useState("");
  const [gender, setGender] = useState("female");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);

  if (!(fontsLoaded && itimLoaded && suezLoaded && raviLoaded)) return null;

  const onSubmit = async () => {
    if (!name || !phone || !password || !confirm) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      // 🔹 Call backend -> /api/auth/signup
      await dispatch(
        registerUser({
          name,
          gender,
          phonenumber: phone,
          password,
        })
      ).unwrap();

      // ✅ Only if backend SUCCESS (user saved + OTP sent) → go to Verification
      navigation.replace("Verification");
    } catch (err) {
      // err is message from rejectWithValue
      Alert.alert("Sign Up Failed", err || "Something went wrong");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BG }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.heading}>Sign Up</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
            style={styles.input}
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.radioRow}>
            <Radio
              selected={gender === "male"}
              onPress={() => setGender("male")}
              label="Male"
            />
            <Radio
              selected={gender === "female"}
              onPress={() => setGender("female")}
              label="Female"
            />
          </View>

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

          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Re-enter password"
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
              {authStatus === "loading" ? "Please wait..." : "Sign Up"}
            </Text>
          </Pressable>

          {/* 🔹 Already have account? Link to SignIn */}
          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Already have an account? </Text>
            <Pressable onPress={() => navigation.replace("SignIn")}>
              <Text style={styles.bottomLink}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BG,
    paddingVertical: 10,
  },
  container: {
    width: "90%",
    backgroundColor: BG,
    alignItems: "center",
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
  radioRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 6,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    backgroundColor: "#fff",
  },
  radioOuterActive: {
    borderColor: PRIMARY,
  },
  radioInner: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: PRIMARY,
  },
  radioLabel: {
    fontFamily: "SuezOne_400Regular",
    fontSize: 10,
    color: "#000",
  },
  button: {
    backgroundColor: PRIMARY,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 35,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
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

export default SignUp;
