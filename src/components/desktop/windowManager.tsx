// src/components/Desktop/WindowManager.tsx
'use client';
import React, { createContext, useContext, useState } from 'react';

type WindowID = 'about-bio' | 'about-portrait' | 'archive';

interface WindowState {
  id: WindowID;
  isOpen: boolean;
  z: number;
}

interface Manager {
  windows: WindowState[];
  open: (id: WindowID) => void;
  close: (id: WindowID) => void;
  bringToFront: (id: WindowID) => void;
}

const ctx = createContext<Manager | null>(null);

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const [windows, set] = useState<WindowState[]>([]);

  const open = (id: WindowID) => {
    set(ws => {
      if (ws.find(w => w.id === id)?.isOpen) return ws;
      const maxZ = ws.reduce((m, w) => Math.max(m, w.z), 0);
      return [...ws, { id, isOpen: true, z: maxZ + 1 }];
    });
  };

  const close = (id: WindowID) => {
    set(ws => ws.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const bringToFront = (id: WindowID) => {
    set(ws => {
      const maxZ = ws.reduce((m, w) => Math.max(m, w.z), 0);
      return ws.map(w => w.id === id ? { ...w, z: maxZ + 1 } : w);
    });
  };

  return (
    <ctx.Provider value={{ windows, open, close, bringToFront }}>
      {children}
    </ctx.Provider>
  );
}

export function useWindowManager() {
  const m = useContext(ctx);
  if (!m) throw new Error('useWindowManager');
  return m;
}
