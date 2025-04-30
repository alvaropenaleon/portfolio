'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { windowDefaults, type Geometry } from './windowDefaults';

/* ───────── Types ───────── */
export type WindowID = 'about' | 'archive' | 'work';

interface Win {
  id: WindowID;
  path: string;            // /archive?query=foo&page=2
  geom: Geometry;
  z: number;
  visible: boolean;        // true after iframe load
}

interface Ctx {
  windows: Win[];
  open(id: WindowID, params?: Record<string, string>): void;
  markLoaded(id: WindowID): void;
  close(id: WindowID): void;
  bringToFront(id: WindowID): void;
}

const WinCtx = createContext<Ctx | null>(null);

/* ───────── Provider ───────── */
export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [wins, setWins] = useState<Win[]>([]);

  /* ── iframe → parent sync ── */
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== 'iframe-path') return;

      const { id, path } = e.data as { id: WindowID; path: string };

      router.replace(path.startsWith('/') ? path : '/' + path);

      setWins(ws => ws.map(w => (w.id === id ? { ...w, path } : w)));
    };

    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, [router]);

  /* ── helpers ── */
  const buildPath = (id: WindowID, params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return `/${id}${qs}`;
  };

  /* ── actions ── */
  const open = (id: WindowID, params?: Record<string, string>) => {
    const path = buildPath(id, params);
    router.push(path);

    setWins(ws => {
      const maxZ = Math.max(0, ...ws.map(w => w.z));
      const found = ws.find(w => w.id === id);
      if (found) {
        return ws.map(w =>
          w.id === id ? { ...w, path, z: maxZ + 1 } : w
        );
      }
      return [
        ...ws,
        {
          id,
          path,
          geom: windowDefaults[id],
          z: maxZ + 1,
          visible: false,
        },
      ];
    });
  };

  const markLoaded = (id: WindowID) =>
    setWins(ws => ws.map(w => (w.id === id ? { ...w, visible: true } : w)));

  const close = (id: WindowID) =>
    setWins(ws => {
      const remaining = ws.filter(w => w.id !== id);
      /* --- choose what should be in the browser bar --- */
      if (remaining.length === 0) {
        router.replace('/');                     // clean desktop
      } else {
        /* pick top-most remaining window */
        const top = remaining.reduce((a, b) => (a.z > b.z ? a : b));
        router.replace(top.path);
      }
      return remaining;
    });

  const bringToFront = (id: WindowID) =>
    setWins(ws => {
      const maxZ = Math.max(0, ...ws.map(w => w.z));
      return ws.map(w => (w.id === id ? { ...w, z: maxZ + 1 } : w));
    });

  /* ── auto-open window that matches current URL ── */
  useEffect(() => {
    if (typeof window === 'undefined') return;          // SSR guard
    const url  = new URL(window.location.href);
    const seg  = url.pathname.split('/')[1];            // 'about' | 'archive'
    const id   = seg as WindowID;

    if (['about', 'archive', 'work'].includes(id)) {
      const params: Record<string, string> = {};
      url.searchParams.forEach((v, k) => (params[k] = v));
      open(id, Object.keys(params).length ? params : undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WinCtx.Provider value={{ windows: wins, open, close, bringToFront, markLoaded }}>
      {children}
    </WinCtx.Provider>
  );
}

/* ───────── Hook ───────── */
export function useWindowManager() {
  const ctx = useContext(WinCtx);
  if (!ctx) throw new Error('useWindowManager must be used within provider');
  return ctx;
}
