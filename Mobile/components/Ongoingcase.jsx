import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const BAR_BG = "#D7D7D7";
const ACCENT = "#3E28FF";

const OngoingPage = ({ complaints = [], onView }) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Ongoing Complaints</Text>

      {complaints.length === 0 && (
        <Text style={styles.emptyText}>No pending complaints for today.</Text>
      )}

      {/* Notification bars */}
      {complaints.map((item) => (
        <Pressable
          key={item.id}
          style={styles.notificationBar}
          onPress={() => onView && onView(item)}
        >
          {/* LEFT ACCENT BAR */}
          <View style={styles.accentBar} />

          {/* MAIN CONTENT */}
          <View style={styles.contentWrapper}>
            {/* Customer name */}
            <Text style={styles.customerName} numberOfLines={1}>
              {item.customerName || "Unknown Customer"}
            </Text>

            {/* Problem + Sub problem */}
            <Text style={styles.problemText} numberOfLines={1}>
              {item.problem || "No main problem"}
              {item.subProblem ? ` • ${item.subProblem}` : ""}
            </Text>
          </View>

          {/* RIGHT: View button */}
          <View style={styles.viewWrapper}>
            <Pressable
              style={styles.viewButton}
              onPress={() => onView && onView(item)}
            >
              <Text style={styles.viewButtonText}>View</Text>
            </Pressable>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#3E28FF",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  emptyText: {
    fontSize: 11,
    color: "#555",
    marginTop: 4,
  },
  notificationBar: {
    backgroundColor: BAR_BG,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    minHeight: 52,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  accentBar: {
    width: 4,
    height: "100%",
    borderRadius: 999,
    backgroundColor: ACCENT,
    marginRight: 8,
  },
  contentWrapper: {
    flex: 1,
  },
  customerName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
    marginBottom: 2,
  },
  problemText: {
    fontSize: 11,
    color: "#333",
  },
  viewWrapper: {
    marginLeft: 10,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#3E28FF",
  },
  viewButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFF",
  },
});

export default OngoingPage;
