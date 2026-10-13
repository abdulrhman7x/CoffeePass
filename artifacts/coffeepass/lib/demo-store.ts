"use client";
import { useCallback, useSyncExternalStore } from "react";
import { isPlanId, type PlanId } from "./data";

const KEY = "coffeepass:v1";
export type DemoState = { plan: PlanId | null; active: boolean; used: number; log: { c: string; t: number }[] };
const EMPTY: DemoState = { plan: null, active: false, used: 0, log: [] };

let cache: DemoState | null = null;
const subs = new Set<() => void>();

function read(): DemoState {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object") {
      cache = EMPTY;
      return cache;
    }
    const plan = isPlanId(parsed.plan) ? parsed.plan : null;
    const maxCups = 20;
    const used = Number.isInteger(parsed.used) ? Math.min(maxCups, Math.max(0, parsed.used)) : 0;
    const log = Array.isArray(parsed.log)
      ? parsed.log
          .filter((entry: unknown) => entry && typeof entry === "object"
            && typeof (entry as { c?: unknown }).c === "string"
            && typeof (entry as { t?: unknown }).t === "number"
            && Number.isFinite((entry as { t: number }).t))
          .slice(0, 6)
      : [];
    cache = { plan, active: parsed.active === true, used, log };
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
