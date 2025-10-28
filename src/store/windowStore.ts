import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { WindowPayloads, WindowID } from '@/lib/definitions';
import type { Geometry } from '@/components/desktop/windowDefaults';
import { windowDefaults, type GeometryOrFn } from '@/components/desktop/windowDefaults';

type Route = { 
  pathname: `/${WindowID}`; 
  params: Record<string, string>; 
};

type Win = {
  id: WindowID;
  z: number;
  geom: Geometry;
  open: boolean;
  title?: string;
  userMoved?: boolean;
  route: Route;
  payload?: WindowPayloads[WindowID];
};

interface WindowStore {
  wins: Record<WindowID, Win | undefined>;
  open(id: WindowID, init?: { payload?: WindowPayloads[WindowID]; pathOverride?: string }): void;
  close(id: WindowID): void;
  bringToFront(id: WindowID): void;
  move(id: WindowID, geom: Geometry): void;
  clampAllToViewport(vw: number, vh: number): void;
  setTitle(id: WindowID, title: string): void;
  setPayload(id: WindowID, payload: WindowPayloads[WindowID]): void;
  setParam(id: WindowID, key: string, value?: string): void;
  replaceParams(id: WindowID, params: Record<string, string | undefined>): void;
}

/** Resolve geometry entry which may be a function */
function resolveGeometry(entry: GeometryOrFn): Geometry {
  return typeof entry === 'function' ? entry() : entry;
}

/** Clamp geometry to viewport with gutter */
const GUTTER = 15;
const SAFE_TOP = 35;

function clampToViewport(
  g: Geometry,
  vw = typeof window !== 'undefined' ? window.innerWidth : g.width,
  vh = typeof window !== 'undefined' ? window.innerHeight : g.height
): Geometry {
  const safeHeight = vh - SAFE_TOP;

  const w = Math.min(g.width, vw);
  const h = Math.min(g.height, safeHeight);

  const left = Math.min(Math.max(g.left, GUTTER), vw - w - GUTTER);
  const top = Math.min(Math.max(g.top, SAFE_TOP), vh - h - GUTTER); // start below SAFE_TOP

  return { ...g, width: w, height: h, left, top };
}

function getDefaultGeometry(id: WindowID): Geometry {
  if (typeof window === 'undefined') {
    return { width: 800, height: 600, left: 100, top: 100 };
  }
  const resolved = resolveGeometry(windowDefaults[id]);
  return clampToViewport(resolved, window.innerWidth, window.innerHeight - SAFE_TOP);
}

function updateBrowserUrl(state: Record<WindowID, Win | undefined>) {
  if (typeof window === 'undefined') return;
  
  const validWins = Object.values(state).filter((w): w is Win => Boolean(w) && w!.open);
  const topWin = validWins.length > 0 
    ? validWins.reduce((a, b) => a.z > b.z ? a : b)
    : null;
  
  if (topWin) {
    const params = new URLSearchParams();
    Object.entries(topWin.route.params).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const search = params.toString();
    const newUrl = topWin.route.pathname + (search ? `?${search}` : '');
    window.history.replaceState(null, '', newUrl);
  } else {
    // No windows open, go to root
    window.history.replaceState(null, '', '/');
  }
}

export const useWindowStore = create<WindowStore>()(
  devtools((set) => ({
    wins: {},
    
    open: (id, init) => {
      set((state) => {
        const existing = state.wins[id];
        const maxZ = Math.max(0, ...Object.values(state.wins).filter(Boolean).map(w => w!.z));
        
        if (existing) {
          // Reset geometry to default position when reopening a window
          const defaultGeom = getDefaultGeometry(id);
          
          const updatedWin = {
            ...existing,
            z: maxZ + 1,
            open: true,
            geom: existing.userMoved ? existing.geom : defaultGeom, // Keep custom position only if user moved it
            userMoved: false, // Reset userMoved flag when reopening
            payload: init?.payload ?? existing.payload,
          };
          
          // Handle pathOverride for custom URLs (like Work category)
          if (init?.pathOverride) {
            const url = new URL(init.pathOverride, 'http://localhost');
            const params: Record<string, string> = {};
            url.searchParams.forEach((value, key) => {
              params[key] = value;
            });
            updatedWin.route = { pathname: `/${id}`, params };
          } else {
            // Clear route params when opening without pathOverride
            updatedWin.route = { pathname: `/${id}`, params: {} };
          }
          
          const newState = {
            wins: {
              ...state.wins,
              [id]: updatedWin
            }
          };
          setTimeout(() => updateBrowserUrl(newState.wins), 0);
          return newState;
        }
        
        // Create new window
        const newWin: Win = {
          id,
          z: maxZ + 1,
          geom: getDefaultGeometry(id),
          open: true,
          route: { pathname: `/${id}`, params: {} },
          payload: init?.payload,
          userMoved: false,
        };
        
        // Handle pathOverride for new windows
        if (init?.pathOverride) {
          const url = new URL(init.pathOverride, 'http://localhost');
          const params: Record<string, string> = {};
          url.searchParams.forEach((value, key) => {
            params[key] = value;
          });
          newWin.route = { pathname: `/${id}`, params };
        }
        
        const newState = {
          wins: {
            ...state.wins,
            [id]: newWin
          }
        };
        setTimeout(() => updateBrowserUrl(newState.wins), 0);
        return newState;
      });
    },
    
    close: (id) => {
      set((state) => {
        const win = state.wins[id];
        if (!win) return state;
        
        const newState = {
          wins: {
            ...state.wins,
            [id]: { 
              ...win, 
              open: false,
              // Reset position to default when closing
              geom: getDefaultGeometry(id),
              userMoved: false
            }
          }
        };
        
        // Clear archive-specific state when closing archive window
        if (id === 'archive' && newState.wins[id]) {
          newState.wins[id]!.route.params = {};
          // Clear payload to ensure fresh start
          newState.wins[id]!.payload = undefined;
        }
        
        setTimeout(() => updateBrowserUrl(newState.wins), 0);
        return newState;
      });
    },
    
    bringToFront: (id) => {
      set((state) => {
        const win = state.wins[id];
        if (!win) return state;
        const maxZ = Math.max(0, ...Object.values(state.wins).filter(Boolean).map(w => w!.z));
        
        const newState = {
          wins: {
            ...state.wins,
            [id]: { ...win, z: maxZ + 1 }
          }
        };
        setTimeout(() => updateBrowserUrl(newState.wins), 0);
        return newState;
      });
    },
    
    move: (id, geom) => {
      set((state) => {
        const win = state.wins[id];
        if (!win) return state;
        return {
          wins: {
            ...state.wins,
            [id]: { ...win, geom, userMoved: true }
          }
        };
      });
    },
    
    clampAllToViewport: (vw, vh) => {
      set((state) => {
        const newWins = { ...state.wins };
        Object.keys(newWins).forEach((id) => {
          const win = newWins[id as WindowID];
          if (!win) return;
          
          const base = resolveGeometry(windowDefaults[id as WindowID]);
          if (!win.userMoved) {
            newWins[id as WindowID] = {
              ...win,
              geom: clampToViewport(base, vw, vh - SAFE_TOP)
            };
          } else {
            newWins[id as WindowID] = {
              ...win,
              geom: clampToViewport(
                { ...win.geom, width: base.width, height: base.height },
                vw, 
                vh - SAFE_TOP
              )
            };
          }
        });
        return { wins: newWins };
      });
    },
    
    setTitle: (id, title) => {
      set((state) => {
        const win = state.wins[id];
        if (!win) return state;
        return {
          wins: {
            ...state.wins,
            [id]: { ...win, title }
          }
        };
      });
    },
    
    setPayload: (id, payload) => {
      set((state) => {
        const win = state.wins[id];
        if (!win) return state;
        return {
          wins: {
            ...state.wins,
            [id]: { ...win, payload }
          }
        };
      });
    },
    
    setParam: (id, key, value) => {
      set((state) => {
        const win = state.wins[id];
        if (!win) return state;
        const newParams = { ...win.route.params };
        if (value === undefined || value === '') {
          delete newParams[key];
        } else {
          newParams[key] = value;
        }
        const newWins = {
          ...state.wins,
          [id]: {
            ...win,
            route: { ...win.route, params: newParams }
          }
        };
        setTimeout(() => updateBrowserUrl(newWins), 0);
        return { wins: newWins };
      });
    },
    
    replaceParams: (id, params) => {
      set((state) => {
        const win = state.wins[id];
        if (!win) return state;
        const cleanParams: Record<string, string> = {};
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== '') {
            cleanParams[k] = v;
          }
        });
        const newWins = {
          ...state.wins,
          [id]: {
            ...win,
            route: { ...win.route, params: cleanParams }
          }
        };
        setTimeout(() => updateBrowserUrl(newWins), 0);
        return { wins: newWins };
      });
    },
  }))
);