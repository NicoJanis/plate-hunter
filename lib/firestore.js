// lib/firestore.js
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where
} from "firebase/firestore";
import { STATES } from "../data/atAreas";
import { auth, authReady, db } from "./firebase";

const userRef = () => doc(collection(db, "users"), auth.currentUser?.uid);

export function listenSpots(cb) {
  authReady.then(() => {
    const spotsCol = collection(userRef(), "spots");
    return onSnapshot(query(spotsCol, orderBy("at", "desc")), (snap) => {
      const items = snap.docs.map((d) => {
        const data = d.data();
        return { id: d.id, ...data, at: data.at?.toDate?.() || new Date() };
      });
      cb(items);
    }, (err) => console.warn("listenSpots error:", err));
  });
}

export async function addSpot(code) {
  await authReady;
  const state = STATES.find((s) => s.codes.includes(code))?.id || "unknown";
  const ref = doc(collection(userRef(), "spots"));
  await setDoc(ref, { code, state, at: serverTimestamp() });
}

export async function removeSpot(code) {
  await authReady;
  const q = query(collection(userRef(), "spots"), where("code", "==", code));
  const snap = await getDocs(q);
  const dels = snap.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(dels);
}

export async function getAllSpots() {
  await authReady;
  const snap = await getDocs(collection(userRef(), "spots"));
  return snap.docs.map((d) => {
    const data = d.data();
    return { id: d.id, ...data, at: data.at?.toDate?.() || new Date() };
  });
}
