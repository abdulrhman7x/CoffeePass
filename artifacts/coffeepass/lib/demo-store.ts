"use client";
import { useCallback, useSyncExternalStore } from "react";
import type { PlanId } from "./data";

const KEY = "coffeepass:v1";
export type DemoState = { plan: PlanId | null; active: boolean; used: number; log: { c: string; t: number }[] };
const EMPTY: DemoState = { plan: null, active: false, used: 0, log: [] };

let cache: DemoState | null = null;
const subs = new Set<() => void>();

function read(): DemoState {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const p = raw ? JSON.parse(raw) : null;
    cache = p && typeof p === "object" ? { ...EMPTY, ...p, log: Array.isArray(p.log) ? p.log.slice(0, 6) : [] } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}
function write(next: DemoState) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  subs.forEach((f) => f());
}
const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };

export function useDemo() {
  const state = useSyncExternalStore(subscribe, read, () => EMPTY);
  const update = useCallback((fn: (s: DemoState) => DemoState) => write(fn(read())), []);
  return { state, update, reset: () => write(EMPTY) };
}
