import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Image, Pressable, Text, TextInput, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { ALL_CODES, STATES, STATE_SEALS } from "../../data/atAreas";
import { Colors } from "../../lib/colors";
import { addSpot, listenSpots, removeSpot } from "../../lib/firestore";

export default function Spotted() {
  const [query, setQuery] = useState("");
  const [codes, setCodes] = useState([]);
  const confettiRef = useRef(null);
  const [shoot, setShoot] = useState(false);

  useEffect(() => {
    const unsub = listenSpots((spots) => setCodes(spots.map((s) => s.code)));
    return () => unsub && unsub();
  }, []);

  const spottedSet = useMemo(() => new Set(codes), [codes]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Only show unspotted codes; if you want to show both, remove the .filter
    return ALL_CODES
      .filter(c => !spottedSet.has(c))
      .filter(c => c.toLowerCase().startsWith(q));
  }, [query, spottedSet]);

  const handleToggle = async (code) => {
    if (spottedSet.has(code)) {
      await removeSpot(code);
      Haptics.selectionAsync();
    } else {
      await addSpot(code);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShoot(true); // confetti
      setTimeout(() => setShoot(false), 1200);
    }
  };

  const findState = (code) => STATES.find((s) => s.codes.includes(code));

  return (
    <View style={{ flex:1, backgroundColor: Colors.background, padding: 16 }}>
      {shoot && <ConfettiCannon autoStart count={60} origin={{ x: 180, y: 0 }} fadeOut fallSpeed={2500} />}
      <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 8 }}>Mark an area code as spotted</Text>

      <TextInput
        placeholder="Type area code (e.g., W, L, GU)"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="characters"
        style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#E5E7EB" }}
      />

      <Text style={{ color: Colors.muted, marginTop: 10 }}>
        {filtered.length} suggestions
      </Text>

      <FlatList
        style={{ marginTop: 8 }}
        data={filtered}
        keyExtractor={(i) => i}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const st = findState(item);
          const already = spottedSet.has(item);
          return (
            <Pressable
              onPress={() => handleToggle(item)}
              style={{
                backgroundColor: "#fff",
                padding: 14,
                borderRadius: 12,
                marginBottom: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Image source={STATE_SEALS[st?.id]} style={{ width: 28, height: 28, borderRadius: 6 }} resizeMode="contain" />
                <View>
                  <Text style={{ fontWeight: "800", fontSize: 16 }}>{item}</Text>
                  <Text style={{ color: Colors.muted }}>{st?.name}</Text>
                </View>
              </View>
              <Ionicons
                name={already ? "checkmark-circle" : "add-circle-outline"}
                size={24}
                color={already ? Colors.green : Colors.blue}
              />
            </Pressable>
          );
        }}
      />

      <Text style={{ textAlign: "center", color: Colors.muted, marginTop: 12 }}>
        Tip: tap again on a spotted code to unmark it.
      </Text>
    </View>
  );
}
