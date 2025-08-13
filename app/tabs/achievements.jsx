import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import AchievementCard from "../../components/AchievementCard";
import { STATES } from "../../data/atAreas";
import { Colors } from "../../lib/colors";
import { listenSpots } from "../../lib/firestore";
import { dayWithMost, fastestStateCompletion, longestStreak, totalActiveDays } from "../../lib/stats";

function levelFrom(total) {
  if (total >= 60) return "diamond";
  if (total >= 35) return "gold";
  if (total >= 15) return "silver";
  if (total >= 5)  return "bronze";
  return "bronze";
}
function progressToNext(total) {
  const thresholds = [5, 15, 35, 60];
  const next = thresholds.find(t => total < t);
  if (!next) return 1;
  const prev = thresholds.filter(t => t <= total).slice(-1)[0] || 0;
  const span = next - prev;
  const done = total - prev;
  return Math.max(0, Math.min(1, done / span));
}

export default function Achievements() {
  const [spots, setSpots] = useState([]);
  const [burst, setBurst] = useState(false);
  const prevUnlocked = useRef(new Set());

  useEffect(() => {
    const unsub = listenSpots((arr) => setSpots(arr));
    return () => unsub && unsub();
  }, []);

  const codes = useMemo(() => spots.map(s => s.code), [spots]);
  const total = new Set(codes).size;
  const totalPossible = STATES.reduce((a,b)=>a+b.codes.length,0);
  const pct = totalPossible ? total/totalPossible : 0;

  const byState = useMemo(() =>
    STATES.map(s => ({
      id: s.id,
      name: s.name,
      total: s.codes.length,
      done: s.codes.filter(c => codes.includes(c)).length
    })), [codes]);

  const statesDone = byState.filter(s => s.total>0 && s.done === s.total).length;
const SALZBURG_CODES = STATES.find(s => s.id === "SBG").codes;
const salzburgFound = codes.filter(code => SALZBURG_CODES.includes(code));
const pctSlzb = salzburgFound.length / SALZBURG_CODES.length;
  // achievements (unified signature: compute unlocked + progress + level)
  const achievements = [
    {
      id: "collector",
      title: "Collector Level",
      subtitle: `${total} / ${totalPossible} codes`,
      icon: "medal-outline",
      level: levelFrom(total),
      progress: progressToNext(total),
      unlocked: total >= 1
    },
    {
      id: "state-mastery",
      title: "State Mastery",
      subtitle: `${statesDone} states completed`,
      icon: "ribbon-outline",
      level: statesDone >= 7 ? "diamond" : statesDone >= 5 ? "gold" : statesDone >= 3 ? "silver" : "bronze",
      progress: Math.min(1, statesDone/9),
      unlocked: statesDone >= 1
    },
    {
      id: "halfway",
      title: "Halfway Hero",
      subtitle: `${Math.round(pct*100)}% complete`,
      icon: "rocket-outline",
      level: pct >= 1 ? "diamond" : pct >= 0.75 ? "gold" : pct >= 0.5 ? "silver" : "bronze",
      progress: pct,
      unlocked: pct >= 0.5
    },
    {
      id: "salzburggirl",
      title: "Salzburg Girly",
      subtitle: `${Math.round(pctSlzb * 100)}% complete`,
      icon: "rose-outline", // maybe change to something Salzburg-themed?
      level: pctSlzb >= 1 ? "diamond" 
            : pctSlzb >= 0.75 ? "gold" 
            : pctSlzb >= 0.5 ? "silver" 
            : "bronze",
      progress: pctSlzb,
      unlocked: pctSlzb >= 0.5
    }
  ];

  // Confetti on *new* unlock of state mastery milestones (3,5,9)
  useEffect(() => {
    const milestones = [3,5,9];
    const was = prevUnlocked.current;
    const now = new Set(achievements.filter(a => a.unlocked).map(a => a.id + statesDone)); // include count to re-fire
    let fire = false;
    milestones.forEach(m => {
      if (statesDone >= m && !was.has("state"+m)) { now.add("state"+m); fire = true; }
    });
    if (fire) {
      setBurst(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setBurst(false), 1500);
    }
    prevUnlocked.current = now;
  }, [statesDone]);

  // Stats
  const most = dayWithMost(spots);
  const streak = longestStreak(spots);
  const active = totalActiveDays(spots);
  const fastest = fastestStateCompletion(spots, STATES); // may be null

  return (
    <View style={{ flex:1, backgroundColor: Colors.background, padding: 16 }}>
      {burst && <ConfettiCannon autoStart count={100} origin={{ x: 180, y: 0 }} fadeOut fallSpeed={2500} />}

      <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 12 }}>Achievements</Text>

      <View style={{ gap: 12 }}>
        {achievements.map(a => (
          <AchievementCard
            key={a.id}
            title={a.title}
            subtitle={a.subtitle}
            icon={a.icon}
            level={a.level}
            progress={a.progress}
            unlocked={a.unlocked}
          />
        ))}
      </View>

      <Text style={{ fontSize: 18, fontWeight: "800", marginTop: 18, marginBottom: 8 }}>Stats</Text>
      <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 14, gap: 8, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10 }}>
        <Text style={{ fontWeight: "700" }}>
          Day with most plates:{" "}
          <Text style={{ fontWeight: "800" }}>
            {most.day ? `${most.day} (${most.count})` : "—"}
          </Text>
        </Text>
        <Text style={{ fontWeight: "700" }}>
          Longest streak: <Text style={{ fontWeight: "800" }}>{streak}</Text> days
        </Text>
        <Text style={{ fontWeight: "700" }}>
          Active days: <Text style={{ fontWeight: "800" }}>{active}</Text>
        </Text>
        <Text style={{ fontWeight: "700" }}>
          Fastest state:{" "}
          <Text style={{ fontWeight: "800" }}>
            {fastest ? `${fastest.stateId} in ${fastest.days} day${fastest.days===1?"":"s"}` : "—"}
          </Text>
        </Text>
      </View>
    </View>
  );
}
