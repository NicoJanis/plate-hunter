import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { StateCard } from "../../components/StateCard";
import { STATES } from "../../data/atAreas";
import { Colors } from "../../lib/colors";

import { listenSpots } from "../../lib/firestore";

const router = useRouter();

export default function Home() {
  const [codes, setCodes] = useState([]);
  useEffect(() => {
    const unsub = listenSpots((spots) => setCodes(spots.map((s) => s.code)));
    return () => unsub && unsub();
  }, []);

  const byState = useMemo(() =>
    STATES.map(s => ({
      id: s.id, name: s.name,
      total: s.codes.length,
      done: s.codes.filter(c => codes.includes(c)).length
    })), [codes]);

  const total = STATES.reduce((a,b) => a + b.codes.length, 0);
  const done = new Set(codes).size;

  return (
    <ScrollView style={{ flex:1, backgroundColor: Colors.background }} contentContainerStyle={{ gap: 16, padding: 16, paddingBottom: 100 }}>
      <View style={{ backgroundColor: "#fff", padding: 18, borderRadius: 18, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: "800" }}>Plate Hunter</Text>
        <Text style={{ color: Colors.muted, marginTop: 4 }}>{done} / {total} area codes spotted</Text>
      </View>

      {byState.map((s) => (
        <StateCard
          key={s.id}
          id={s.id}
          name={s.name}
          total={s.total}
          done={s.done}
          onPress={() => router.push(`/state/${s.id}`)}
        />
      ))}
    </ScrollView>
  );
}
