'use client';

import { createContext, useContext, useState } from 'react';
import { windowDefaults, type Geometry } from './windowDefaults';

/* ─────────────────── Types ─────────────────── */
export type WindowID = 'about' | 'archive' | 'work';

interface Win {
  id: WindowID;
  isOpen: boolean;
  z: number;
  geom: Geometry;
}

interface Ctx {
  windows: Win[];
  open(id: WindowID): void;
  close(id: WindowID): void;
  bringToFront(id: WindowID): void;
}

/* ────────────────── Context ─────────────────── */
const WinCtx = createContext<Ctx | null>(null);

/* ───────────────── Provider ─────────────────── */
export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const [wins, setWins] = useState<Win[]>([]);

  /* ---------- actions ---------- */
  const open = (id: WindowID) =>
    setWins(ws => {
      if (ws.find(w => w.id === id)) return ws;        // already open
      const maxZ = Math.max(0, ...ws.map(w => w.z));
      return [
        ...ws,
        {
          id,
          isOpen: true,
          z: maxZ + 1,
          geom: windowDefaults[id],                    // ← default geometry
        },
      ];
    });

  const close = (id: WindowID) =>
    setWins(ws => ws.filter(w => w.id !== id));

  const bringToFront = (id: WindowID) =>
    setWins(ws => {
      const maxZ = Math.max(0, ...ws.map(w => w.z));
      return ws.map(w => w.id === id ? { ...w, z: maxZ + 1 } : w);
    });

  return (
    <WinCtx.Provider value={{ windows: wins, open, close, bringToFront }}>
      {children}
    </WinCtx.Provider>
  );
}

/* ──────────────── Hook ──────────────────────── */
export function useWindowManager() {
  const ctx = useContext(WinCtx);
  if (!ctx) throw new Error('useWindowManager must be used within provider');
  return ctx;
}
