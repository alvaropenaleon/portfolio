"use client";

import { CSSProperties, ReactNode, useRef, useEffect, useState } from "react";
import type { Geometry } from "./windowDefaults";
import styles from "@/styles/desktop/windowFrame.module.css";
import clsx from 'clsx';

const OVERFLOW = 400;

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
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; left: number; top: number; w: number; h: number } | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onFocus();
    const el = frameRef.current!;
    const rect = el.getBoundingClientRect();
    dragRef.current = { x: e.clientX, y: e.clientY, left: rect.left, top: rect.top, w: rect.width, h: rect.height };
    el.setPointerCapture(e.pointerId);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!dragRef.current) return;
    e.preventDefault();
    const { x, y, left, top, w, h } = dragRef.current;
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    const vw = window.innerWidth, vh = window.innerHeight;
    const newLeft = Math.min(Math.max(left + dx, - OVERFLOW), vw - w  + OVERFLOW);
    const newTop  = Math.min(Math.max(top + dy, 0), vh - h  + OVERFLOW);
    const el = frameRef.current!;
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

  useEffect(() => {
    if (!hidden) {
      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    } else {
      setIsOpen(false);
    }
  }, [hidden]);

  return (
    <div
      ref={frameRef}
      onPointerDown={onFocus}
      className={clsx(
        styles.windowFrame,
        isOpen && styles.open,
        className
      )}
      style={{
        position: "absolute",
        visibility: hidden ? "hidden" : "visible",
        zIndex,
        ...style,
      }}
    >
      <div className={styles.titleBar} onPointerDown={onPointerDown}>
        <button className={styles.closeBtn} onPointerDown={e => e.stopPropagation()} onClick={onClose} />
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.windowContent}>{children}</div>
    </div>
  );
}
