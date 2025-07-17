"use client";

import {
  useCallback, startTransition, createContext, useContext,
  useState, useEffect, ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { windowDefaults, type GeometryOrFn, type Geometry } from "./windowDefaults";

/* ---------- constants ------------------------------------------------ */
// const GUTTER = 16;
const CASCADE_SHIFT = 30;

export type WindowID = "about" | "archive" | "work";

interface Win {
  id: WindowID;
  path: string;
  geom: Geometry;
  z: number;
  visible: boolean;
  userMoved?: boolean;
}

interface Ctx {
  windows: Win[];
  open(id: WindowID, params?: Record<string, string>): void;
  markLoaded(id: WindowID): void;
  close(id: WindowID): void;
  bringToFront(id: WindowID): void;
  moveWindow(id: WindowID, geom: Geometry): void;
}

const WinCtx = createContext<Ctx | null>(null);

/* ---------- utils ---------------------------------------------------- */

function resolveGeometry(entry: GeometryOrFn): Geometry {
  return typeof entry === "function" ? entry() : entry;
}

function clampToViewport(
  g: Geometry,
  vw = window.innerWidth,
  vh = window.innerHeight
): Geometry {
  const w = Math.min(g.width, vw);
  const h = Math.min(g.height, vh);
  const left = Math.min(Math.max(g.left, 0), vw - w);
  const top = Math.min(Math.max(g.top, 0), vh - h);
  return { ...g, width: w, height: h, left, top };
}

/* ================================================================== */
/*  Provider                                                          */
/* ================================================================== */

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [wins, setWins] = useState<Win[]>([]);

  const buildPath = (id: WindowID, params?: Record<string, string>) =>
    `/${id}${params ? "?" + new URLSearchParams(params).toString() : ""}`;

  const open = useCallback((id: WindowID, params?: Record<string, string>) => {
    const path = buildPath(id, params);

    setWins(ws => {
      const maxZ = Math.max(0, ...ws.map(w => w.z));
      const exists = ws.find(w => w.id === id);
      if (exists) return ws.map(w => w.id === id ? { ...w, path, z: maxZ + 1 } : w);

      const vw = window.innerWidth, vh = window.innerHeight;
      const base = resolveGeometry(windowDefaults[id]);

        const isCentered = typeof windowDefaults[id] === 'function'; // centered = function-based
        const shift = isCentered ? 0 : ws.length * CASCADE_SHIFT;

        const geom = clampToViewport({
        ...base,
        left: (typeof base.left === "number" ? base.left : 0) + shift,
        top:  (typeof base.top  === "number" ? base.top  : 0) + shift,
        }, vw, vh);

      return [...ws, { id, path, geom, z: maxZ + 1, visible: false, userMoved: false }];
    });

    startTransition(() => router.push(path));
  }, [router]);

  useEffect(() => {
    function handleResize() {
      const vw = window.innerWidth, vh = window.innerHeight;
      setWins(ws =>
        ws.map(w => {
          const base = resolveGeometry(windowDefaults[w.id]);

          if (!w.userMoved) {
            return { ...w, geom: clampToViewport(base, vw, vh) };
          }

          return {
            ...w,
            geom: clampToViewport({ ...w.geom, width: base.width, height: base.height }, vw, vh),
          };
        })
      );
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const markLoaded = (id: WindowID) =>
    setWins(ws => ws.map(w => w.id === id ? { ...w, visible: true } : w));

  const close = (id: WindowID) => {
    const remaining = wins.filter(w => w.id !== id);
    setWins(remaining);
    startTransition(() => {
      if (!remaining.length) router.replace("/");
      else {
        const top = remaining.reduce((a, b) => (a.z > b.z ? a : b));
        router.replace(top.path);
      }
    });
  };

  const bringToFront = (id: WindowID) =>
    setWins(ws => {
      const maxZ = Math.max(0, ...ws.map(w => w.z));
      return ws.map(w => w.id === id ? { ...w, z: maxZ + 1 } : w);
    });

  const moveWindow = (id: WindowID, geom: Geometry) =>
    setWins(ws =>
      ws.map(w => w.id === id ? { ...w, geom, userMoved: true } : w)
    );

  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const msg = e.data;

      if (msg?.type === "iframe-path") {
        const { id, path: newPath } = msg as { id: WindowID; path: string };
        router.replace(newPath.startsWith("/") ? newPath : "/" + newPath);
        setWins(ws => ws.map(w => {
          if (w.id !== id) return w;
          const [oldBase] = w.path.split("?");
          const [newBase] = newPath.split("?");
          return oldBase === newBase ? w : { ...w, path: newPath };
        }));
      }

      if (msg?.type === "open-window") {
        const { id, params } = msg as { id: WindowID; params?: Record<string, string>; };
        open(id, params);
      }

      if (msg?.type === "close-window") close((msg as { id: WindowID }).id);
    };

    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, [router, open, close]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const seg = url.pathname.split("/")[1] as WindowID;
    if (["about", "archive", "work"].includes(seg)) {
      const baseParams: Record<string, string> = {};
      url.searchParams.forEach((v, k) => (baseParams[k] = v));
      open(seg, Object.keys(baseParams).length ? baseParams : undefined);
    }
  }, [open]);

  return (
    <WinCtx.Provider
      value={{ windows: wins, open, close, bringToFront, markLoaded, moveWindow }}
    >
      {children}
    </WinCtx.Provider>
  );
}

/* ---------- hook -------------------------------------------------- */
export function useWindowManager() {
  const ctx = useContext(WinCtx);
  if (!ctx) throw new Error("useWindowManager must be used within provider");
  return ctx;
}
