"use client";

import { CSSProperties, ReactNode, useRef, useEffect, useState } from "react";
import type { Geometry } from "./windowDefaults";
import styles from "@/styles/desktop/windowFrame.module.css";
import clsx from 'clsx';

const OVERFLOW = 300;

interface Props {
  title: string;
  zIndex: number;
  children: ReactNode;
  onClose(): void;
  onFocus(): void;
  onMove?(geom: Geometry): void;
  style?: CSSProperties;
  hidden?: boolean;
  className?: string;
  titleControls?: ReactNode; 
}

export default function WindowFrame({
  title, 
  zIndex, 
  children, 
  onClose, 
  onFocus, 
  onMove,
  style = {}, 
  hidden = false, 
  className = '',
    titleControls,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragTargetRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; left: number; top: number; w: number; h: number } | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [isfullscreen, setIsFullscreen] = useState(false);
  const prevGeomRef = useRef<Geometry | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    // e.stopPropagation();
    onFocus();
    if (isfullscreen) return;
    if (e.button !== 0) return; // Only left button
    if (e.detail > 1) return; // Ignore double-click
  
    const el = frameRef.current!;
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: el.offsetLeft,
      top: el.offsetTop,
      w: el.offsetWidth,
      h: el.offsetHeight,
    };

    const target = e.target as HTMLElement; 
    dragTargetRef.current = target;
    
    try { target.setPointerCapture(e.pointerId); } catch {}
    target.setPointerCapture(e.pointerId);
    target.addEventListener("pointermove", onPointerMove);
    target.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!dragRef.current) return;
    e.preventDefault();
    const { x, y, left, top, w, h } = dragRef.current;
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    const el = frameRef.current!;
    const parent = (el.offsetParent as HTMLElement) || document.documentElement;

    const vw = parent.clientWidth;
    const vh = parent.clientHeight;

    const newLeft = Math.min(Math.max(left + dx, - OVERFLOW), vw - w  + OVERFLOW);
    const newTop  = Math.min(Math.max(top + dy, 0), vh - h  + OVERFLOW);

    el.style.left = newLeft + "px";
    el.style.top  = newTop  + "px";
  };

  const onPointerUp = (e: PointerEvent) => {
    const el = frameRef.current!;
    el.releasePointerCapture(e.pointerId);
    el.removeEventListener("pointermove", onPointerMove);
    el.removeEventListener("pointerup", onPointerUp);
    if (dragRef.current && onMove) {
      const left = parseFloat(el.style.left || "0");
      const top  = parseFloat(el.style.top  || "0");
      onMove({
        width: dragRef.current.w,
        height: dragRef.current.h,
        left,
        top,
      });
    }
    dragRef.current = undefined;
  };

  const toggleFullScreen = () => {
    const el = frameRef.current!;
  
    if (!isfullscreen) {
      prevGeomRef.current = {
        width: el.offsetWidth,
        height: el.offsetHeight,
        left: el.offsetLeft,
        top: el.offsetTop,
      };
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
      if (prevGeomRef.current && onMove) {
        onMove(prevGeomRef.current);
      }
    }
  };
  
  
  useEffect(() => {
    if (!hidden) {
      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    } else {
      setIsOpen(false);
    }
  }, [hidden]);

  const frameStyle: CSSProperties = {
    position: "absolute",
    visibility: hidden ? "hidden" : "visible",
    zIndex,
    ...style,
  };
  if (isfullscreen) {
    Object.assign(frameStyle, {
      position: "fixed",
      top: "var(--menu-safe-top, 0px)",
      left: 0,
      width: "100vw",
      height: "calc(100dvh - var(--menu-safe-top, 0px))",
    });
  }


  return (
    <div
      ref={frameRef}
      onPointerDown={onFocus}
      className={clsx(
        styles.windowFrame,
        isOpen && styles.open,
        isfullscreen && styles.fullscreen,
        className
      )}
      style={frameStyle}
    >
      <div 
        className={styles.titleBar} 
        onPointerDown={onPointerDown}
        onDoubleClick={toggleFullScreen}
        >
        <button 
            className={styles.closeBtn}
            onPointerDown={e => e.stopPropagation()} 
            onClick={onClose}
            aria-label="Close window"
        />
        <button 
            className={styles.zoomBtn}
            onPointerDown={e => e.stopPropagation()} 
            onClick={toggleFullScreen}
            aria-label={isfullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        />
        <span className={styles.title}>
            {title}
        </span>
        {titleControls}
      </div>
      <div className={styles.windowContent}>
        {children}
        </div>
    </div>
  );
}
