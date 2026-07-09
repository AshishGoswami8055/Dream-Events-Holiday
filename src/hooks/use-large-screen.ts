"use client";

import { useSyncExternalStore } from "react";

function subscribeLargeScreen(callback: () => void) {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getLargeScreenSnapshot() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function getLargeScreenServerSnapshot() {
  return false;
}

export function useLargeScreen() {
  return useSyncExternalStore(
    subscribeLargeScreen,
    getLargeScreenSnapshot,
    getLargeScreenServerSnapshot
  );
}
