// components/MainPlatte.js
import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Text, Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import mainplatte from "../assets/mainplatte.png";
import user from "../assets/user.png";
import points from "../assets/points.png";

import {
  fetchUserCounts,
  fetchMonthlyPointsByAgent,
} from "../app/features/complainSlice";

const MainPlatte = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  const { userCounts, monthlyPoints } = useSelector((state) => state.complaints);

  // ✅ DAILY COUNTS + MONTHLY POINTS
  useEffect(() => {
    if (!authUser?._id) return;

    dispatch(fetchUserCounts(authUser._id));

    // ✅ Current month points (backend default current month, but we pass monthKey anyway for safety)
    dispatch(fetchMonthlyPointsByAgent({ agentId: authUser._id }));
  }, [authUser?._id, dispatch]);

  // ✅ Show monthly points inside badge
  const totalPoints = Math.round(Number(monthlyPoints?.points || 0));

  // ✅ Small animation for points number
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [totalPoints, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image source={mainplatte} style={styles.image} resizeMode="contain" />

      {/* User image */}
      <View style={styles.userWrapper}>
        <Image source={user} style={styles.userImage} resizeMode="contain" />
      </View>

      {/* Points section */}
      <View style={styles.statsWrapper}>
        <Text style={styles.pointsLabel}>POINTS</Text>

        <View style={styles.pointsBadge}>
          <Image source={points} style={styles.pointsImage} resizeMode="contain" />

          {/* ✅ Monthly points number */}
          <Animated.Text
            style={[
              styles.pointsCount,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {totalPoints}
          </Animated.Text>
        </View>

        {/* ✅ optional small subtitle (remove if you don't want) */}
        <Text style={styles.monthText}>
          {monthlyPoints?.monthKey || ""}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    position: "relative",
    marginBottom: 10,
    marginTop: -15,
  },

  image: {
    width: "90%",
    height: 220,
    borderRadius: 30,
  },

  userWrapper: {
    position: "absolute",
    left: "12%",
    top: "14%",
    width: "35%",
    height: "75%",
    justifyContent: "center",
  },

  userImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },

  statsWrapper: {
    position: "absolute",
    left: "48%",
    top: "10%",
    width: "45%",
    alignItems: "center",
  },

  pointsImage: {
    width: 200,
    height: 200,
    marginTop: -55,
    marginLeft: -40,
  },

  pointsBadge: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  pointsCount: {
    position: "absolute",
    fontSize: 45,
    fontWeight: "900",
    color: "#FFFFFF",
    // ✅ perfectly center for your badge (adjust if needed)
    top: "10%",
    left: "15%",
  },

  pointsLabel: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 40,
    marginLeft: -50,
  },

  monthText: {
    marginTop: -40,
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
    opacity: 0.8,
    marginLeft: -55,
  },
});

export default MainPlatte;
