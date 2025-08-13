import { MotiView } from "moti";
import { Text } from "react-native";
import { Colors } from "../lib/colors";

export function Badge({ label, unlocked }) {
  return (
    <MotiView
      from={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "timing" }}
      style={{ width: 120, height: 120, borderRadius: 24, backgroundColor: unlocked ? Colors.green : "#E5E7EB", justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ color: "#fff", fontWeight: "800", textAlign: "center" }}>{label}</Text>
    </MotiView>
  );
}
