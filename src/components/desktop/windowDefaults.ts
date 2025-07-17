// src/components/desktop/windowDefaults.ts
import type { WindowID } from './windowManager';

/** Geometry for the window’s initial footprint */
export interface Geometry {
  width: number;
  height: number;
  left: number;
  top: number;
  position?: 'absolute' | 'fixed';
}

export type GeometryFn = () => Geometry;
export type GeometryOrFn = Geometry | GeometryFn;

/** Constants used for layout logic */
const GUTTER = 16;
const ARCHIVE_MAX_W = 1400;
const ARCHIVE_MAX_H = 700;
const ABOUT_MAX_W   = 700;
const ABOUT_MAX_H   = 440;

/** Per-window default size & position */
export const windowDefaults: Record<WindowID, GeometryOrFn> = {
  about: () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(ABOUT_MAX_W, vw - GUTTER * 2);
    const h = Math.min(ABOUT_MAX_H, vh - GUTTER * 2);
    return {
      position: "fixed",
      width: w,
      height: h,
      left: (vw - w) / 3,
      top: (vh - h) / 7,
    };
  },

  archive: () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(ARCHIVE_MAX_W, vw - GUTTER * 2);
    const h = Math.min(ARCHIVE_MAX_H, vh - GUTTER * 2);
    return {
      position: "fixed",
      width: w,
      height: h,
      left: (vw - w) / 2,
      top: (vh - h) / 1.5,
    };
  },

  work: {
    width: 820,
    height: 560,
    left: 120,
    top: 60,
  },
};
