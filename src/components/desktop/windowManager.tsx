"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { windowDefaults, type Geometry } from "./windowDefaults";

export type WindowID = "about" | "archive" | "work" | "project" | "carousel";

interface Win {
  id: WindowID;
  path: string;
  geom: Geometry;
  z: number;
  visible: boolean;
}

interface Ctx {
  windows: Win[];
  open(id: WindowID, params?: Record<string, string>): void;
  markLoaded(id: WindowID): void;
  close(id: WindowID): void;
  bringToFront(id: WindowID): void;
}

const WinCtx = createContext<Ctx | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [wins, setWins] = useState<Win[]>([]);

  // Build path helper
  const buildPath = (id: WindowID, params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return `/${id}${qs}`;
  };

  // Action: open a window
  const open = (id: WindowID, params?: Record<string, string>) => {
    const path = buildPath(id, params);
    router.push(path);

    setWins((ws) => {
      const maxZ = Math.max(0, ...ws.map((w) => w.z));
      const found = ws.find((w) => w.id === id);
      if (found) {
        return ws.map((w) =>
          w.id === id ? { ...w, path, z: maxZ + 1 } : w
        );
      }
      return [
        ...ws,
        { id, path, geom: windowDefaults[id], z: maxZ + 1, visible: false },
      ];
    });
  };

  // Action: mark iframe loaded
  const markLoaded = (id: WindowID) =>
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, visible: true } : w)));

  // Action: close a window
  const close = (id: WindowID) =>
    setWins((ws) => {
      const remaining = ws.filter((w) => w.id !== id);
      if (remaining.length === 0) {
        router.replace("/"); 
      } else {
        const top = remaining.reduce((a, b) => (a.z > b.z ? a : b));
        router.replace(top.path);
      }
      return remaining;
    });

  // Action: bring to front
  const bringToFront = (id: WindowID) =>
    setWins((ws) => {
      const maxZ = Math.max(0, ...ws.map((w) => w.z));
      return ws.map((w) => (w.id === id ? { ...w, z: maxZ + 1 } : w));
    });

  // Listen for postMessage from iframes
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const msg = e.data;

      if (msg?.type === "iframe-path") {
        // sync URL and update iframe src only on page change
        const { id, path: newPath } = msg as { id: WindowID; path: string };
        router.replace(newPath.startsWith("/") ? newPath : "/" + newPath);
        setWins((ws) =>
          ws.map((w) => {
            if (w.id !== id) return w;
            const [oldBase] = w.path.split("?");
            const [newBase] = newPath.split("?");
            return oldBase === newBase ? w : { ...w, path: newPath };
          })
        );
      }

      if (msg?.type === "open-window") {
        const { id, params } = msg as {
          id: WindowID;
          params?: Record<string, string>;
        };
        open(id, params);
      }

      if (msg?.type === "close-window") {
        const { id } = msg as { id: WindowID };
        setWins((ws) => ws.filter((w) => w.id !== id));
        // update URL to remaining top or fallback
        setTimeout(() => {
          const rem = wins.filter((w) => w.id !== id);
          if (rem.length === 0) {
            router.replace("/archive");
          } else {
            const top = rem.reduce((a, b) => (a.z > b.z ? a : b));
            router.replace(top.path);
          }
        }, 0);
      }
    };

    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, [router, wins]);

  // Auto‑open on initial load if URL matches
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const seg = url.pathname.split("/")[1] as WindowID;
    if (["about", "archive", "work", "project", "carousel"].includes(seg)) {
      const params: Record<string, string> = {};
      url.searchParams.forEach((v, k) => (params[k] = v));
      open(seg, Object.keys(params).length ? params : undefined);
    }
  }, []);

  return (
    <WinCtx.Provider
      value={{ windows: wins, open, close, bringToFront, markLoaded }}
    >
      {children}
    </WinCtx.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WinCtx);
  if (!ctx) throw new Error("useWindowManager must be used within provider");
  return ctx;
}
