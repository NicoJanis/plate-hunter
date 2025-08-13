import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { STATES, STATE_SEALS } from "../../data/atAreas";
import { Colors } from "../../lib/colors";
import { addSpot, listenSpots, removeSpot } from "../../lib/firestore";

export default function StateDetail() {
  const { id } = useLocalSearchParams(); // "W", "ST", etc.
  const stateData = STATES.find((s) => s.id === id);
  const [spots, setSpots] = useState([]);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    const unsub = listenSpots((arr) => setSpots(arr));
    return () => unsub && unsub();
  }, []);

  const ownedSet = useMemo(() => new Set(spots.filter(s => s.state === id).map(s => s.code)), [spots, id]);

  const owned = useMemo(() =>
    stateData.codes
      .filter(c => ownedSet.has(c))
      .map(code => {
        const hit = spots.find(s => s.code === code);
        return { code, at: hit?.at };
      })
      .sort((a,b) => (b.at?.getTime?.()||0) - (a.at?.getTime?.()||0))
    , [spots, id]);

  const locked = useMemo(() => stateData.codes.filter(c => !ownedSet.has(c)), [stateData, ownedSet]);

  useEffect(() => {
    if (owned.length === stateData.codes.length && stateData.codes.length > 0) {
      setBurst(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const t = setTimeout(() => setBurst(false), 1500);
      return () => clearTimeout(t);
    }
  }, [owned.length]);

  const toggle = async (code) => {
    if (ownedSet.has(code)) {
      await removeSpot(code);
      Haptics.selectionAsync();
    } else {
      await addSpot(code);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <View style={{ flex:1, backgroundColor: Colors.background, padding: 16 }}>
      {burst && <ConfettiCannon autoStart count={80} origin={{ x: 180, y: 0 }} fadeOut fallSpeed={2500} />}

      {/* Header row (content; actual back button comes from Stack header) */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <Image source={STATE_SEALS[stateData.id]} style={{ height: 100, width: 60,  borderRadius: 8 }} />
        <Text style={{ fontSize: 20, fontWeight: "800" }}>{stateData.name}</Text>
      </View>

      {/* Spotted */}
      <Text style={{ fontWeight: "800", marginBottom: 8 }}>Spotted</Text>
      {owned.length === 0 ? (
        <Text style={{ color: Colors.muted, marginBottom: 8 }}>No spots yet.</Text>
      ) : null}
      <FlatList
        data={owned}
        keyExtractor={(i) => i.code}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggle(item.code)}
            style={{ backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontWeight: "800", fontSize: 16 }}>{item.code}</Text>
              <Text style={{ color: Colors.muted }}>
                {item.at ? new Date(item.at).toLocaleString() : ""}
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={22} color={Colors.green} />
          </Pressable>
        )}
      />

      {/* Locked */}
      <Text style={{ fontWeight: "800", marginVertical: 8 }}>Locked</Text>
      <FlatList
        data={locked}
        keyExtractor={(i) => i}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggle(item)}
            style={{ backgroundColor: "#F3F4F6", borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <Text style={{ fontWeight: "800", fontSize: 16, color: "#9CA3AF" }}>{item}</Text>
            <Ionicons name="add-circle-outline" size={22} color={Colors.blue} />
          </Pressable>
        )}
      />
    </View>
  );
}
