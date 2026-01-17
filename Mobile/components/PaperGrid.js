import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Animated, Image } from "react-native";

import topicwisepaper from "../assets/topicwisepaper.png";
import pastpapers from "../assets/pastpapers.png";
import modelpapers from "../assets/modelpapers.png";
import dailyquizz from "../assets/dailyquizz.png";

export default function PaperGrid() {
  const [active, setActive] = useState(null);
  const timeoutRef = useRef(null);

  const scales = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  const papers = [
    { title: "Daily Quiz", img: dailyquizz },
    { title: "Topic wise papers", img: topicwisepaper },
    { title: "Model papers", img: modelpapers },
    { title: "Past papers", img: pastpapers },
  ];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const zoomOut = (index) => {
    Animated.spring(scales[index], {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
    setActive(null);
  };

  const onPressCard = (index) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (active !== null && active !== index) {
      zoomOut(active);
    }

    Animated.spring(scales[index], {
      toValue: 1.06,
      useNativeDriver: true,
      friction: 6,
    }).start();

    setActive(index);
    timeoutRef.current = setTimeout(() => zoomOut(index), 800);
  };

  return (
    <View style={styles.grid}>
      {papers.map((item, idx) => (
        <Pressable key={item.title} onPress={() => onPressCard(idx)} style={styles.cardWrap}>
          <Animated.View style={[styles.card, { transform: [{ scale: scales[idx] }] }]}>
            <Image source={item.img} style={styles.icon} />
            <Text style={styles.text}>{item.title}</Text>
          </Animated.View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 12,
    paddingBottom: 16,
  },

  cardWrap: {
    width: "48%",
    height: 140,
    marginBottom: 12,
  },

  card: {
    flex: 1,
    backgroundColor: "#FDFEFF",
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 6,

    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8, // gap between text and image
  },

  icon: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
});
