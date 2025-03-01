"use client";

import { useState } from "react";
import ClockClient from "@/components/about/clockClient";
import styles from "@/styles/ui/menu.module.css";
import { Mail } from "lucide-react";
import ThemeButton from "@/components/ui/themeButton";

export default function MenuBar({ user }: { user: { email: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`${styles.menuContainer} ${isOpen ? styles.expanded : ""}`}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className={styles.menuBar}>
        <p className={styles.menuText} onMouseEnter={() => setIsOpen(true)}>
          Menu
        </p>
        <div className={styles.rightIcons}>
            <a href={`mailto:${user.email}`}>
            <Mail size={17} />
            </a>
            <ThemeButton /> 
            <ClockClient />
        </div>
      </div>

      {isOpen && (
        <div className={styles.menuDropdown}>
          <a href="/about">About</a>
          <a href="/archive">Archive</a>
          <a href={`mailto:${user.email}`}>Contact</a>
        </div>
      )}
    </div>
  );
}