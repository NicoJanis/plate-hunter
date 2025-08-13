// lib/stats.js
export function groupByDay(spots) {
  const map = new Map(); // 'YYYY-MM-DD' -> count
  spots.forEach((s) => {
    const d = new Date(s.at || s.atMs || s.at_ts || Date.now());
    const key = d.toISOString().slice(0,10);
    map.set(key, (map.get(key) || 0) + 1);
  });
  return map;
}

export function dayWithMost(spots) {
  const map = groupByDay(spots);
  let bestKey = null, best = 0;
  for (const [k, v] of map) if (v > best) { best=v; bestKey=k; }
  return bestKey ? { day: bestKey, count: best } : { day: null, count: 0 };
}

export function longestStreak(spots) {
  const map = groupByDay(spots);
  const days = Array.from(map.keys()).sort();
  if (days.length === 0) return 0;
  let streak = 1, best = 1;
  for (let i=1;i<days.length;i++) {
    const prev = new Date(days[i-1]);
    const cur = new Date(days[i]);
    const diff = (cur - prev)/(1000*60*60*24);
    if (diff === 1) { streak++; best = Math.max(best, streak); }
    else if (diff > 1) { streak = 1; }
  }
  return best;
}

export function totalActiveDays(spots) {
  return groupByDay(spots).size;
}

export function fastestStateCompletion(spots, states) {
  // returns { stateId, days } for the state with smallest span between first & last unique code
  const byState = {};
  spots.forEach(s => {
    const t = (s.at && s.at.getTime && s.at.getTime()) || Date.parse(s.at) || Date.now();
    if (!byState[s.state]) byState[s.state] = [];
    byState[s.state].push({ code: s.code, t });
  });
  let best = null;
  for (const st of states) {
    const arr = (byState[st.id] || []).sort((a,b) => a.t - b.t);
    const uniq = new Map();
    arr.forEach((x) => { if (!uniq.has(x.code)) uniq.set(x.code, x.t); });
    if (uniq.size === 0) continue;
    const allCodes = st.codes;
    const seen = Array.from(uniq.entries()).filter(([code]) => allCodes.includes(code));
    if (seen.length < allCodes.length) continue; // not completed
    // find min time span covering all codes in state (approx: between first seen and last seen of that state's codes)
    const times = seen.map(([,t]) => t);
    const span = (Math.max(...times) - Math.min(...times)) / (1000*60*60*24);
    const days = Math.max(1, Math.round(span));
    if (!best || days < best.days) best = { stateId: st.id, days };
  }
  return best; // may be null if no completed states
}
