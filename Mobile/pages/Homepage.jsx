// screens/HomePage.js
import React, { useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import MainPlatte from "../components/MainPlatte";
import DateTime from "../components/DateTime";
import UserCard from "../components/User";
import OngoingPage from "../components/Ongoingcase";

import { fetchTodayPendingComplaintsByUser } from "../app/features/complainSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const authUser = useSelector((state) => state.auth.user);
  const {
    todayPendingComplaints,
    todayPendingStatus,
    todayPendingCount,
  } = useSelector((state) => state.complaints);

  // 🔄 Load today's pending complaints for logged-in user
  useEffect(() => {
    if (authUser?._id) {
      dispatch(fetchTodayPendingComplaintsByUser(authUser._id));
    }
  }, [authUser, dispatch]);

  // Map backend complaints -> simple shape for OngoingPage
  const mappedComplaints = (todayPendingComplaints || []).map((c) => ({
    id: c._id,
    customerName: c.CustomerName || "-",
    problem: c.mainProblem?.name || "-",
    subProblem: c.subProblem?.name || "-",
  }));

  const handleViewComplaint = (item) => {
    navigation.navigate("dailyreport", {
      defaultStatus: "Pending",
      fromToday: true,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EBEBEB" />

      {/* Top Row: User left + DateTime right */}
      <View style={styles.topRow}>
        <UserCard />
        <DateTime />
      </View>

      {/* MainPlatte image */}
      <View style={styles.imageWrapper}>
        <MainPlatte />
      </View>

      {/* Ongoing section – today pending */}
      <View style={styles.ongoingWrapper}>
        <OngoingPage
          complaints={mappedComplaints}
          onView={handleViewComplaint}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBEBEB",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 25, // 🔹 Shift everything a bit down
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 5, // 🔹 Slightly reduced, overall still lower due to paddingTop
    zIndex: 2,
  },
  imageWrapper: {
    marginTop: 30, // 🔹 Slightly more space after header row
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    zIndex: 1,
  },
  ongoingWrapper: {
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 15, // 🔹 Removed negative margin, added proper spacing
  },
});

export default HomePage;
