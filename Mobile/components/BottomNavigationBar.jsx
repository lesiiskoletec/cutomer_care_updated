import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import Fullreport from "../assets/fullreport.png";
import Dailyreport from "../assets/dailyReport.png";
import add from "../assets/add.png";
import home from "../assets/Home.png";

const BottomNavgationBar = ({ onHome, onDaily, onFull, onAdd }) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.navContainer}>
        {/* Home */}
        <TouchableOpacity onPress={onHome} style={styles.iconWrapper}>
          <Image source={home} style={styles.largeIcon} resizeMode="contain" />
        </TouchableOpacity>

        {/* Add Icon (Transparent Circle with White Border) */}
        <TouchableOpacity onPress={onAdd} style={styles.addWrapper}>
          <View style={styles.addCircle}>
            <Image source={add} style={styles.addIcon} resizeMode="contain" />
          </View>
        </TouchableOpacity>

        {/* Daily Report (Bigger Icon for Emphasis) */}
        <TouchableOpacity onPress={onDaily} style={styles.iconWrapper}>
          <Image source={Dailyreport} style={styles.extraLargeIcon} resizeMode="contain" />
        </TouchableOpacity>

        

        {/* Full Report */}
        <TouchableOpacity onPress={onFull} style={styles.iconWrapper}>
          <Image source={Fullreport} style={styles.largeIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 12,
    width: "100%",
    alignItems: "center",
  },

  navContainer: {
    width: 328,
    height: 58,
    backgroundColor: "rgba(25, 0, 251, 0.74)", // #1900FB with 74% opacity
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
  },

  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },

  // Normal main icons
  largeIcon: {
    width: 32,
    height: 32,
  },

  // Larger Daily Report icon
  extraLargeIcon: {
    width: 38,
    height: 38,
  },

  // Add icon transparent circle with white border
  addWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  addCircle: {
    width: 37,
    height: 37,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: {
    width: 26,
    height: 26,
  },
});

export default BottomNavgationBar;
