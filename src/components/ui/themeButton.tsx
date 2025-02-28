"use client";

import { Sun, SunDim } from "lucide-react";
import { useTheme } from "next-themes";

export default function ColorThemeBtn() {
  const { setTheme, resolvedTheme } = useTheme();

  if (!resolvedTheme) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        margin: 0,
      }}
    >
      {resolvedTheme === "dark" ? <SunDim size={20} /> : <Sun size={20} />}
    </button>
  );
}