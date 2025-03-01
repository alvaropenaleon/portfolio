"use client";

import { Sun, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function ColorThemeBtn() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!resolvedTheme) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      style={{
        /*background: "none",*/
        border: "none",
        cursor: "pointer",
        /*padding: 0,
        margin: 0,*/
      }}
    >
      {resolvedTheme === "dark" ? <SunDim size={18} /> : <Sun size={18} />}
    </button>
  );
}