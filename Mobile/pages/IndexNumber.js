import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function IndexNumber({ route }) {
  const navigation = useNavigation();
  const [indexNumber, setIndexNumber] = useState("");

  const grade = route?.params?.grade || "";
  const subject = route?.params?.subject || "";
  const teacher = route?.params?.teacher || "";

  const handleSubmit = () => {
    if (!indexNumber.trim()) {
      Alert.alert("Error", "Please enter your Index Number");
      return;
    }

    // ✅ Navigate to Lessons page
    navigation.navigate("Lessons", {
      indexNumber,
      grade,
      subject,
      teacher,
    });
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Index Number</Text>

      <TextInput
        placeholder="Enter your index number"
        value={indexNumber}
        onChangeText={setIndexNumber}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#94A3B8"
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1F5EEB",
    marginBottom: 16,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",

    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    marginBottom: 20,
  },

  button: {
    width: "100%",
    backgroundColor: "#1F5EEB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",

    elevation: 5,
    shadowColor: "#1F5EEB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
});
