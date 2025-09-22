"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/ui/themeColourButton.module.css";

type Swatch = { key: string; triple: string; label: string };

const DEFAULT_GREY = "173, 173, 179"; // current --brand-grey-rgb
const SWATCHES: Swatch[] = [
  { key: "red",    triple: "255, 0, 8",   label: "Red" },
  { key: "orange", triple: "245, 116, 1", label: "Orange" },
  { key: "yellow", triple: "239, 175, 0", label: "Yellow" },
  { key: "green",  triple: "2, 183, 1",   label: "Green" },
  { key: "blue",   triple: "0, 112, 253", label: "Blue" },
  { key: "purple", triple: "167, 64, 204",label: "Purple" },
  { key: "grey",   triple: DEFAULT_GREY,  label: "Grey (default)" },
];

const STORAGE_KEY = "brand-grey-rgb";

export default function ThemeColourButton() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>(DEFAULT_GREY);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Load saved choice on mount
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) || DEFAULT_GREY;
    apply(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on outside click / Esc
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function apply(triple: string) {
    setCurrent(triple);
    document.documentElement.style.setProperty("--brand-grey-rgb", triple);
    try { localStorage.setItem(STORAGE_KEY, triple); } catch {}
  }

  function onSelect(triple: string) {
    apply(triple);
    setOpen(false);
    // return focus to trigger for accessibility
    btnRef.current?.focus();
  }

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <button
        ref={btnRef}
        className={styles.trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Choose interface colour"
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={styles.dot}
          style={{ backgroundColor: `rgb(${current})` }}
          aria-hidden
        />
      </button>

      {open && (
        <div role="menu" className={styles.pop}>
          {SWATCHES.map((s) => (
            <button
              key={s.key}
              role="menuitem"
              type="button"
              className={styles.swatch}
              style={{ backgroundColor: `rgb(${s.triple})` }}
              aria-label={s.label}
              onClick={() => onSelect(s.triple)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
