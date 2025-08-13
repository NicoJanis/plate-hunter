import Ionicons from "@expo/vector-icons/Ionicons";
import { MotiView } from "moti";
import { Text, View } from "react-native";
import { Colors } from "../lib/colors";

const levelColors = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#D4AF37",
  diamond: "#4FD1C5",
};

export default function AchievementCard({ title, subtitle, icon="trophy-outline", level="bronze", progress=1, unlocked=true }) {
  const tint = unlocked ? levelColors[level] || Colors.red : "#E5E7EB";
  const pct = Math.round(progress * 100);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 250 }}
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 14,
        width: "100%",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{
          width: 44, height: 44, borderRadius: 12, backgroundColor: tint + "1A", // ~10% alpha
          alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: tint
        }}>
          <Ionicons name={icon} size={22} color={tint} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "800", fontSize: 16, color: unlocked ? Colors.text : Colors.muted }}>{title}</Text>
          {subtitle ? <Text style={{ color: Colors.muted, marginTop: 2 }}>{subtitle}</Text> : null}
          {/* progress bar */}
          {progress < 1 && (
            <View style={{ height: 8, backgroundColor: "#F1F5F9", borderRadius: 8, marginTop: 8 }}>
              <View style={{ width: `${pct}%`, height: 8, backgroundColor: tint, borderRadius: 8 }} />
            </View>
          )}
        </View>
        <Text style={{ fontWeight: "800", color: tint }}>{unlocked ? "✓" : `${pct}%`}</Text>
      </View>
    </MotiView>
  );
}
