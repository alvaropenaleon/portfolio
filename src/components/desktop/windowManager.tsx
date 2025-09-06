"use client";
import { ReactNode } from "react";
import { useWindowStore } from "@/store/windowStore";
import type { Geometry } from "@/components/desktop/windowDefaults";
import type { WindowPayloads, WindowID } from "@/lib/definitions";

export interface Win {
  id: WindowID;
  z: number;
  geom: Geometry;
  open: boolean;
  title?: string;
  userMoved?: boolean;
  payload?: WindowPayloads[WindowID];
}

/* adapter/provider/hook */
export function WindowManagerProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useWindowManager() {
  const { wins, open, close, bringToFront, move, setTitle } = useWindowStore();
  
  // Convert wins object to array format for compatibility
  const windows = Object.values(wins).filter(Boolean).map(win => win!);

  return {
    windows,
    open,
    close,
    bringToFront,
    moveWindow: move,
    setDynamicTitle: setTitle,
    markLoaded: () => {}, // No-op since we don't track loaded state anymore
  };
}