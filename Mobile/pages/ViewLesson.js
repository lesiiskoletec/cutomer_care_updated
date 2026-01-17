import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import CrossWebView from "../components/CrossWebView";
import YoutubePlayerBox from "../components/YoutubePlayerBox";

const { width } = Dimensions.get("window");

function getYouTubeId(url = "") {
  if (!url) return "";

  const shortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
  if (shortMatch?.[1]) return shortMatch[1];

  const watchMatch = url.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if (watchMatch?.[1]) return watchMatch[1];

  const embedMatch = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
  if (embedMatch?.[1]) return embedMatch[1];

  return "";
}

export default function ReviewComponent({ route }) {
  // ✅ pass these from navigation: youtubeUrl, description
  const youtubeUrl =
    route?.params?.youtubeUrl ?? "https://youtu.be/30cffBrABao";

  const description =
    route?.params?.description ??
    `f,ais biafldaf,a  hkq orejkaf.a wOHdmkh myiq" kùk iy úYajdiodhl f,i f.khkak ks¾udKh l<  wOHdmk fhÿuls'
fuu fhÿu YsIHhkag iy foudmshkag tlu fõÈldjla ;=<ska Wiia .=Kd;aul wOHdmk w;aoelSula ,nd§u wruqKq lr.ksñka ixj¾Okh lr we;'`;

  const videoId = useMemo(() => getYouTubeId(youtubeUrl), [youtubeUrl]);
  const playerHeight = Math.round((width - 32) * 0.56);

  // ✅ WEB HTML player (same method you used)
  const playerHtml = useMemo(() => {
    if (!videoId) return "";

    const src =
      `https://www.youtube-nocookie.com/embed/${videoId}` +
      `?playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&fs=1&controls=1`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
          <style>
            html, body { margin:0; padding:0; width:100%; height:100%; background:#0B1220; overflow:hidden; }
            iframe { width:100%; height:100%; border:0; display:block; background:#0B1220; }
          </style>
        </head>
        <body>
          <iframe
            src="${src}"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
          ></iframe>
        </body>
      </html>
    `;
  }, [videoId]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ✅ YouTube Video FIRST */}
        <View style={styles.playerCard}>
          <View style={[styles.playerBox, { height: playerHeight }]}>
            {!videoId ? (
              <View style={styles.playerFallback}>
                <Text style={styles.fallbackText}>Invalid YouTube link</Text>
              </View>
            ) : Platform.OS === "web" ? (
              <CrossWebView source={{ html: playerHtml }} style={styles.webview} />
            ) : (
              <YoutubePlayerBox videoId={videoId} height={playerHeight} />
            )}
          </View>
        </View>

        {/* ✅ Description BELOW */}
        <Text style={styles.descTitle}>Description :</Text>
        <Text style={styles.desc}>{description}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 16, paddingBottom: 40 },

  playerCard: { borderRadius: 18, marginBottom: 14 },
  playerBox: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#0B1220",
  },
  webview: { width: "100%", height: "100%", backgroundColor: "transparent" },

  playerFallback: { flex: 1, alignItems: "center", justifyContent: "center" },
  fallbackText: { color: "#FFFFFF", fontWeight: "800" },

  descTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 6,
    fontFamily: "FMEmanee", // ✅ Title font
  },

  desc: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
    fontFamily: "FMEmanee", // ✅ Description font
  },
});
