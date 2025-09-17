"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/ui/menu.module.css";
import ThemeButton from "@/components/ui/themeButton";
import ClockClient from "../about/clockClient";
import Image from "next/image";
import { ChevronRight, File, FolderCog, Mail } from "lucide-react";

function FolderIcon({ size = 16 }: { size?: number }) {
  return (
    <Image
      src="/folder.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      sizes={`${size}px`}
      quality={100}
      className={styles.rowIcon}
      style={{ objectFit: "contain" }}
    />
  );
}

export default function MenuBar({ user }: { user: { email: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLElement>(null);

  // Close on outside click (anything that's NOT in trigger or dropdown)
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      const inTrigger = !!triggerRef.current?.contains(t);
      const inDropdown = !!dropdownRef.current?.contains(t);
      if (!inTrigger && !inDropdown) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <div className={`${styles.menuContainer} ${isOpen ? styles.expanded : ""}`}>
      <div className={styles.menuBar}>
        <div className={styles.leftGroup}>
          <h1 className={styles.logo}>🐱</h1>
          <h1 className={styles.logo}>Perfect Blue</h1>

          {/* NEW: tiny wrapper so dropdown aligns with the button via CSS */}
          <div className={styles.menuTrigger}>
            <button
              className={`${styles.menuText} ${isOpen ? styles.menuTextActive : ""}`}
              onClick={() => setIsOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={isOpen}
              aria-controls="menudropdown"
              type="button"
            >
              Menu
            </button>

            {isOpen && (
              <nav id="menudropdown" className={styles.menuDropdown} aria-label="Main">
                <ul className={styles.menuList} role="menu">
                  <li className={styles.item} role="menuitem">
                    <a className={styles.row} href="/about">
                    <span className={styles.label}>
                        <File size={16} className={styles.rowIcon}/>Information
                    </span>
                    </a>
                  </li>
                  <li className={styles.item} role="menuitem">
                    <a className={styles.row} href="/archive">
                    <span className={styles.label}>
                        <FolderCog size={16} className={styles.rowIcon}/>
                        Selected Work
                    </span>
                    </a>
                  </li>

                  <li className={styles.separator} role="separator" />

                  <li className={`${styles.item} ${styles.hasSubmenu}`} role="menuitem" tabIndex={-1}>
                    <button className={styles.row} type="button">
                      <span className={styles.label}>Recent Folders</span>
                      <span className={styles.submenuGlyph} aria-hidden><ChevronRight size={20}/></span>
                    </button>

                    <ul className={styles.submenu} role="menu">
                      <li className={styles.item} role="menuitem">
                        <a className={styles.row} href="/archive?category=Software">
                        <FolderIcon />
                        <span>Software</span>
                        </a>
                      </li>
                      <li className={styles.item} role="menuitem">
                        <a className={styles.row} href="/archive?category=Graphic+Design">
                        <FolderIcon />
                        <span>Graphic Design</span>
                        </a>
                      </li>
                      <li className={styles.item} role="menuitem">
                        <a className={styles.row} href="/archive?category=Science">
                        <FolderIcon />
                        <span>Science</span>
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li className={styles.separator} role="separator" />

                  <li className={styles.item} role="menuitem">
                    <a className={styles.row} href={`mailto:${user.email}`}>
                    <span className={styles.label}>
                        <Mail size={16} className={styles.rowIcon}/>
                        Contact
                    </span>
                    </a>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>

        <div className={styles.rightGroup}>
          <div className={styles.rightIcons}><ThemeButton /></div>
          <ClockClient />
        </div>
      </div>
    </div>
  );
}
