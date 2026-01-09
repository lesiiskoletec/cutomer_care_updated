import React from "react";
import { View, StyleSheet } from "react-native";

const Rootlayout = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBEBEB",
  },
});

export default Rootlayout;
