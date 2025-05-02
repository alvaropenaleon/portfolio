// src/components/desktop/windowDefaults.ts
import type { WindowID } from './windowManager';

/** Geometry for the window’s initial footprint */
export interface Geometry {
    width: number | string;
    height: number | string;
    left: number | string;
    top: number | string;
    position?: 'absolute' | 'fixed';   // defaults to 'absolute'
}

/** Per-window default size & position */
export const windowDefaults: Record<WindowID, Geometry> = {
    about: {
        width: 700,
        height: 480,
        left: 'calc(50% - 350px)',   // centred
        top: 'calc(50% - 240px)',
    },

    archive: {                       // full screen, but leave sidebar visible
        position: 'fixed',
        top: 0,
        left: '96px',                  // sidebar width
        width: 'calc(100vw - 96px)',
        height: '100vh',
    },

    work: {
        width: 820,
        height: 560,
        left: 120,
        top: 60,
    },

    // Project info window
    project: {
        width: 600,
        height: 520,
        left: 200,
        top: 100,
    },
    // Image carousel window
    carousel: {
        width: 480,
        height: 380,
        left: 300,
        top: 140,
    },
};
