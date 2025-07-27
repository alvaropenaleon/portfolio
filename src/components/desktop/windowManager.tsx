// src/components/desktop/windowManager.tsx
"use client";

import {
  useCallback,
  startTransition,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { windowDefaults, type GeometryOrFn, type Geometry } from "./windowDefaults";

export type WindowID = "about" | "archive" | "work";

interface Win {
  id: WindowID;
  path: string;
  geom: Geometry;
  z: number;
  visible: boolean;
  userMoved?: boolean;
  dynamicTitle?: string;
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
/* ---------- constants ------------------------------------------------ */
const GUTTER = 15;
const CASCADE_SHIFT = 30;


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
  const left = Math.min(Math.max(g.left, GUTTER), vw - w - GUTTER);
  const top = Math.min(Math.max(g.top, GUTTER), vh - h - GUTTER);
  return { ...g, width: w, height: h, left, top };
}

/* ================================================================== */
/*  Provider                                                          */
/* ================================================================== */
export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [wins, setWins] = useState<Win[]>([]);
  const winsRef = useRef<Win[]>([]);
  // keep ref in sync
  useEffect(() => {
    winsRef.current = wins;
  }, [wins]);

  const buildPath = (id: WindowID, params?: Record<string, string>) =>
    `/${id}${params ? "?" + new URLSearchParams(params).toString() : ""}`;

  const open = useCallback((id: WindowID, params?: Record<string, string>) => {
    const path = buildPath(id, params);

    setWins(ws => {
      const maxZ = Math.max(0, ...ws.map(w => w.z));
      const exists = ws.find(w => w.id === id);
      if (exists) {
        return ws.map(w =>
          w.id === id ? { ...w, path, z: maxZ + 1 } : w
        );
      }

      const base = resolveGeometry(windowDefaults[id]);
      const shift = typeof windowDefaults[id] === "function" ? 0 : ws.length * CASCADE_SHIFT;
      const geom = clampToViewport({
        ...base,
        left: base.left + shift,
        top: base.top + shift,
      });

      return [
        ...ws,
        { id, path, geom, z: maxZ + 1, visible: false, userMoved: false },
      ];
    });

    startTransition(() => {
      router.push(path);
    });
  }, [router]);

  const close = useCallback((id: WindowID) => {
    // read current from ref
    const remaining = winsRef.current.filter(w => w.id !== id);
    setWins(remaining);

    startTransition(() => {
      if (remaining.length === 0) {
        router.replace("/");
      } else {
        const top = remaining.reduce((a, b) => (a.z > b.z ? a : b));
        router.replace(top.path);
      }
    });
  }, [router]);

  const bringToFront = useCallback((id: WindowID) => {
    setWins(ws => {
      const maxZ = Math.max(0, ...ws.map(w => w.z));
      return ws.map(w =>
        w.id === id ? { ...w, z: maxZ + 1 } : w
      );
    });
  }, []);

  const moveWindow = useCallback((id: WindowID, geom: Geometry) => {
    setWins(ws =>
      ws.map(w => w.id === id ? { ...w, geom, userMoved: true } : w)
    );
  }, []);

  const markLoaded = useCallback((id: WindowID) => {
    setWins(ws =>
      ws.map(w => w.id === id ? { ...w, visible: true } : w)
    );
  }, []);

  /* Re‑center on resize */
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      setWins(ws =>
        ws.map(w => {
          const base = resolveGeometry(windowDefaults[w.id]);
          if (!w.userMoved) {
            return { ...w, geom: clampToViewport(base, vw, vh) };
          }
          return {
            ...w,
            geom: clampToViewport(
              { ...w.geom, width: base.width, height: base.height },
              vw,
              vh
            ),
          };
        })
      );
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* PostMessage handler */
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const msg = e.data;
      if (msg?.type === "iframe-path") {
        const { id, path: newPath, title } = msg as {
          id: WindowID;
          path: string;
          title?: string;
        };

        router.replace(newPath.startsWith("/") ? newPath : "/" + newPath);
        setWins(ws =>
          ws.map(w =>
            w.id !== id
              ? w
              : {
                  ...w,
                  path:
                    newPath.split("?")[0] !== w.path.split("?")[0]
                      ? newPath
                      : w.path,
                  dynamicTitle: title ?? w.dynamicTitle,
                }
          )
        );
      }

      if (msg?.type === "open-window") {
        open(msg.id, msg.params);
      }

      if (msg?.type === "close-window") {
        close(msg.id);
      }
    };

    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, [open, close, router]);

  /* Initial URL → open window on mount */
  useEffect(() => {
    const url = new URL(window.location.href);
    const seg = url.pathname.split("/")[1] as WindowID;
    if (["about", "archive", "work"].includes(seg)) {
      const params: Record<string, string> = {};
      url.searchParams.forEach((v, k) => (params[k] = v));
      open(seg, Object.keys(params).length ? params : undefined);
    }
    // run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WinCtx.Provider
      value={{
        windows: wins,
        open,
        close,
        bringToFront,
        markLoaded,
        moveWindow,
      }}
    >
      {children}
    </WinCtx.Provider>
  );
}

/* ---------- hook -------------------------------------------------- */
export function useWindowManager() {
  const ctx = useContext(WinCtx);
  if (!ctx) throw new Error("useWindowManager must be used within WindowManagerProvider");
  return ctx;
}
