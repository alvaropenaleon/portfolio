"use client"

import { useState, useEffect } from "react";
import ClockClient from "@/components/about/clockClient";
import styles from "@/styles/ui/menu.module.css";
import { Mail, Sun } from "lucide-react";

export default function MenuBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  let lastScrollY = 0;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false); // Hide menu when scrolling down
      } else {
        setIsVisible(true); // Show menu when scrolling up
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${styles.menuContainer} ${isVisible ? "" : styles.hidden}`}>
      <div
        className={styles.menuBar}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <span className={styles.menuText}>Menu</span>
        <span className={styles.icon}>▼</span>
        <div className={styles.rightIcons}>
          <Mail size={20} />
          <Sun size={20} />
          <ClockClient />
        </div>
      </div>
      {isOpen && (
        <div className={styles.menuDropdown}>
          <a href="/about">About</a>
          <a href="/archive">Archive</a>
          <a href="/contact">Contact</a>
          <hr />
          <p>Socials: <a href="https://github.com">GitHub</a>, <a href="https://linkedin.com">LinkedIn</a></p>
        </div>
      )}
    </div>
  );
}
