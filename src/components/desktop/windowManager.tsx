/* ------------------------------------------------------------------ */
/*  windowManager.tsx                                                 */
/* ------------------------------------------------------------------ */
"use client";

import {
  useCallback, startTransition, createContext, useContext,
  useState, useEffect, ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { windowDefaults, type Geometry } from "./windowDefaults";

/* ---------- helpers ------------------------------------------------ */

const GUTTER = 16;              // 1 rem on each edge
const ARCHIVE_MAX_W = 1400;
const ARCHIVE_MAX_H = 700;
const ABOUT_MAX_W   = 700;
const ABOUT_MAX_H   = 440;

const CASCADE_SHIFT  = 30;      // px offset per additional window


function sizeForArchive(vw: number, vh: number) {
  const w = Math.min(ARCHIVE_MAX_W, vw - GUTTER * 2);
  const h = Math.min(ARCHIVE_MAX_H, vh - GUTTER * 2);
  return { w, h };
}

function centredArchiveGeom(vw = window.innerWidth, vh = window.innerHeight): Geometry {
  const { w, h } = sizeForArchive(vw, vh);
  return {
    position: "fixed",
    width: w,
    height: h,
    left: (vw - w) / 2,
    top:  (vh - h) / 1.5,
  };
}

function centredAboutGeom(vw = window.innerWidth, vh = window.innerHeight): Geometry {
      const w = Math.min(ABOUT_MAX_W, vw - GUTTER * 2);
      const h = Math.min(ABOUT_MAX_H, vh - GUTTER * 2);
      return {
        position: "fixed",
        width: w,
        height: h,
        left: (vw - w) / 3,
        top:  (vh - h) / 7,
      };
    }

function clampToViewport(
  g: Geometry,
  vw = window.innerWidth,
  vh = window.innerHeight
): Geometry {
  const w = Math.min(typeof g.width  === "number" ? g.width  : vw, vw);
  const h = Math.min(typeof g.height === "number" ? g.height : vh, vh);
  const left = Math.min(Math.max(typeof g.left === "number" ? g.left : 0, 0), vw - w);
  const top  = Math.min(Math.max(typeof g.top  === "number" ? g.top  : 0, 0), vh - h);
  return { ...g, width: w, height: h, left, top };
}

/* ---------- types -------------------------------------------------- */

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

/* ================================================================== */
/*  Provider                                                          */
/* ================================================================== */

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [wins, setWins] = useState<Win[]>([]);

  const buildPath = (id: WindowID, params?: Record<string, string>) =>
    `/${id}${params ? "?" + new URLSearchParams(params).toString() : ""}`;

  /* --------------------- open ------------------------------------- */
  const open = useCallback((id: WindowID, params?: Record<string, string>) => {
    const path = buildPath(id, params);

    setWins(ws => {
      const maxZ   = Math.max(0, ...ws.map(w => w.z));
      const exists = ws.find(w => w.id === id);

      if (exists) {                       // bring existing to front
        return ws.map(w => w.id === id ? { ...w, path, z: maxZ + 1 } : w);
      }

      /* new window -------------------------------------------------- */
      let geom: Geometry;
      const vw = window.innerWidth, vh = window.innerHeight;

      if (id === "archive") {
        geom = centredArchiveGeom(vw, vh);
    } else if (id === "about") {
        geom = centredAboutGeom(vw, vh);
      } else {
        /* cascade then clamp */
        const base   = windowDefaults[id];
        const shift  = ws.length * CASCADE_SHIFT;
        const w      = typeof base.width  === "number" ? base.width  : vw;
        const h      = typeof base.height === "number" ? base.height : vh;
        const left   = (typeof base.left === "number" ? base.left : 0) + shift;
        const top    = (typeof base.top  === "number" ? base.top  : 0) + shift;
        geom = clampToViewport({ ...base, left, top, width: w, height: h }, vw, vh);
      }

      return [...ws, { id, path, geom, z: maxZ + 1, visible: false, userMoved:false }];
    });

    startTransition(() => router.push(path));
  }, [router]);

  /* --------------------- resize clamp ----------------------------- */
  useEffect(() => {
    function handleResize() {
      const vw = window.innerWidth, vh = window.innerHeight;
      setWins(ws =>
        ws.map(w => {
            if (w.id !== "archive" && w.id !== "about") {
            /* other windows: just clamp */
            return { ...w, geom: clampToViewport(w.geom, vw, vh) };
          }

          if (w.id === "archive") {
            /* --- archive: always recompute size --- */
            const { w: newW, h: newH } = sizeForArchive(vw, vh);
            if (w.userMoved) {
              return {
                ...w,
                geom: clampToViewport({ ...w.geom, width: newW, height: newH }, vw, vh),
              };
            }
            return { ...w, geom: centredArchiveGeom(vw, vh) };
          }

           /* --- about: similar logic with its own max --- */
          const wAbout = Math.min(ABOUT_MAX_W, vw - GUTTER * 2);
          const hAbout = Math.min(ABOUT_MAX_H, vh - GUTTER * 2);

          if (w.userMoved) {
            return {
              ...w,
              geom: clampToViewport({ ...w.geom, width: wAbout, height: hAbout }, vw, vh),
            };
          }
          return { ...w, geom: centredAboutGeom(vw, vh) };
        })
      );
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* --------------------- other actions ---------------------------- */
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
      ws.map(w => w.id === id ? { ...w, geom, userMoved:true } : w)
    );

  /* --------------------- postMessage listener --------------------- */
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

  /* --------------------- initial auto-open ------------------------ */
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

  /* --------------------- provider --------------------------------- */
  return (
    <WinCtx.Provider
      value={{ windows:wins, open, close, bringToFront, markLoaded, moveWindow }}
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
