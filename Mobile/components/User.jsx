// components/UserCard.js
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import {
  useFonts,
  Share_400Regular,
  Share_700Bold,
} from "@expo-google-fonts/share";
import { useSelector } from "react-redux";
import user from "../assets/user.png";

const UserCard = () => {
  const [fontsLoaded] = useFonts({ Share_400Regular, Share_700Bold });
  const authUser = useSelector((state) => state.auth.user);

  if (!fontsLoaded) return null;

  // 🔍 DEBUG LOG
  console.log("🔎 [UserCard] authUser =", authUser);

  const displayName = authUser?.name || "Guest";
  const userIdRaw = authUser?._id || authUser?.id || null;
  const userIdShort =
    userIdRaw && typeof userIdRaw === "string"
      ? userIdRaw.slice(-6)
      : null;

  return (
    <View style={styles.container}>
      {/* Avatar Circle */}
      <View style={styles.avatarWrapper}>
        <Image source={user} style={styles.avatar} resizeMode="contain" />
      </View>

      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.shareText}>Hello</Text>
        <Text style={styles.nameText}>{displayName}</Text>

  
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 45,
    backgroundColor: "#ECF6FF",
    borderWidth: 2,
    borderColor: "#BFADAD",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: 3,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    marginLeft: 12,
    justifyContent: "center",
  },
  shareText: {
    fontFamily: "Share_400Regular",
    fontSize: 11,
    color: "#000",
  },
  nameText: {
    fontFamily: "Share_700Bold",
    fontSize: 20,
    color: "#000",
    marginTop: 2,
  },
  idText: {
    fontFamily: "Share_400Regular",
    fontSize: 10,
    color: "#555",
    marginTop: 2,
  },
  debugIdText: {
    fontSize: 9,
    color: "#999",
    marginTop: 2,
  },
});

export default UserCard;
