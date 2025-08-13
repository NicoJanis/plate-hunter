import { MotiView } from "moti";
import { Image, Pressable, Text, View } from "react-native";
import { STATE_SEALS } from "../data/atAreas";
import { Colors } from "../lib/colors";
import { ProgressRing } from "./ProgressRing";

export function StateCard({ id, name, total, done, onPress }) {
  const progress = total ? done / total : 0;
  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 300 }}
      style={{
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 18,
        gap: 10,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4
      }}
    >
      <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Image source={STATE_SEALS[id]} style={{ width: 36, height: 36, borderRadius: 8 }} resizeMode="contain" />
          <View>
            <Text style={{ fontWeight: "800", fontSize: 16 }}>{name}</Text>
            <Text style={{ color: Colors.muted }}>{done} / {total} spotted</Text>
          </View>
        </View>
        <ProgressRing progress={progress} />
      </Pressable>
    </MotiView>
  );
}
