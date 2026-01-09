import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFonts, Sansita_400Regular } from "@expo-google-fonts/sansita";

const DateTime = () => {
  const [fontsLoaded] = useFonts({ Sansita_400Regular });
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  if (!fontsLoaded) return null;

  // Format time
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "p.m." : "a.m.";
  const hh12 = ((h + 11) % 12) + 1;
  const timeStr = `${hh12}.${m} ${ampm}`;

  // Format date
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).toString().padStart(2, "0");
  const dateStr = `${yyyy}.${mm}.${dd}`;

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{dateStr}</Text>
      <Text style={styles.time}>{timeStr}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 5, // distance from top
    right: 20, // align right
    alignItems: "flex-end",
  },
  date: {
    fontFamily: "Sansita_400Regular",
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  time: {
    fontFamily: "Sansita_400Regular",
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 2,
  },
});

export default DateTime;
