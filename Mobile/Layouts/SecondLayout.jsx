import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomNavgationBar from "../components/BottomNavigationBar";

const SecondLayout = ({ children }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>

      {/* Bottom navigation ONLY in this layout */}
      <View style={styles.bottomBarWrapper}>
        <BottomNavgationBar
          onHome={() => navigation.navigate("Home")}
          onDaily={() => navigation.navigate("dailyreport")}
          onFull={() => navigation.navigate("fullreport")}
          onAdd={() => navigation.navigate("complain")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBEBEB",
  },
  content: {
    flex: 1,
  },

  // ⬆️ Lift bottom navigation slightly upward
  bottomBarWrapper: {
    marginBottom: 22,   // ✔️ Moved a bit more up from the previous 12px
  },
});

export default SecondLayout;
