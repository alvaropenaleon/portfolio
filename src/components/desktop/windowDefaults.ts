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
        left: 'calc(50% - 350px)',
        top: 'calc(50% - 240px)',
    },

    archive: { 
        position: 'fixed',
        top: 95,
        left: 90, 
        width: '100%',
        height: '100%',
    },

    work: {
        width: 820,
        height: 560,
        left: 120,
        top: 60,
    },


};
