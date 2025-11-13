"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/ui/menu.module.css";
import ThemeButton from "@/components/ui/themeButton";
import ClockClient from "../about/clockClient";
import Image from "next/image";
import { ChevronRight, File, Settings, Mail } from "lucide-react";
import { useWindowManager } from "@/components/desktop/windowManager";
import { useWindowStore } from "@/store/windowStore";
import type { WindowPayloads } from "@/lib/definitions";
import ThemeColourButton from "@/components/ui/themeColourButton";

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

type MenuBarProps = {
  user: { email: string };
  preload?: {
    about?: WindowPayloads["about"];
    archive?: WindowPayloads["archive"];
  };
};

export default function MenuBar({ user, preload }: MenuBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLElement>(null);

  const { open, bringToFront } = useWindowManager();
  const { wins, replaceParams } = useWindowStore();

  // --- window open helpers ---------------------------------------------------
  const handleOpenAbout = () => {
    open("about", { payload: preload?.about });   // instant render
    bringToFront("about");
    setIsOpen(false);
  };

  const handleOpenArchive = (qs?: string) => {
    const existing = wins.archive;
    const paramsObj: Record<string, string | undefined> = {};
    if (qs) new URLSearchParams(qs).forEach((v, k) => (paramsObj[k] = v));

    if (existing?.open) {
      // no remount: just update params and focus
      replaceParams("archive", paramsObj);
      bringToFront("archive");
    } else {
      // FIRST open: pass payload so it doesn't show "Initializing..."
      const pathOverride = qs ? `/archive?${qs}` : "/archive";
      open("archive", { payload: preload?.archive, pathOverride });
      bringToFront("archive");
    }
    setIsOpen(false);
  };

  // Close on outside click
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
         {/* 
         <h1 className={styles.logo}>🐱</h1>
          <h1 className={styles.logo}>Perfect Blue</h1>
          */}

<ThemeColourButton />
<div className={styles.menuTrigger} ref={triggerRef}>
            <button
              className={`${styles.menuText} ${isOpen ? styles.menuTextActive : ""}`}
              onClick={() => setIsOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={isOpen}
              aria-controls="menudropdown"
              type="button"
            >
              Navigation
            </button>

            {isOpen && (
              <nav
                id="menudropdown"
                className={styles.menuDropdown}
                aria-label="Main"
                ref={dropdownRef}
              >
                <ul className={styles.menuList} role="menu">
                  <li className={styles.item} role="menuitem">
                    <button className={styles.row} type="button" onClick={handleOpenAbout}>
                      <span className={styles.label}>
                        <File size={16} className={styles.rowIcon} />
                        Information
                      </span>
                    </button>
                  </li>

                  <li className={styles.item} role="menuitem">
                    <button className={styles.row} type="button" onClick={() => handleOpenArchive("category=Work")}>
                      <span className={styles.label}>
                        <Settings size={16} className={styles.rowIcon} />
                        Projects
                      </span>
                    </button>
                  </li>

                  <li className={styles.separator} role="separator" />

                  <li className={`${styles.item} ${styles.hasSubmenu}`} role="menuitem" tabIndex={-1}>
                    <button className={styles.row} type="button">
                      <span className={styles.label}>Recent Folders</span>
                      <span className={styles.submenuGlyph} aria-hidden><ChevronRight size={20} /></span>
                    </button>

                    <ul className={styles.submenu} role="menu">
                      <li className={styles.item} role="menuitem">
                        <button className={styles.row} type="button" onClick={() => handleOpenArchive()}>
                          <FolderIcon />
                          <span>Archive</span>
                        </button>
                      </li>

                      <li className={styles.item} role="menuitem">
                        <button className={styles.row} type="button" onClick={() => handleOpenArchive("category=Software")}>
                          <FolderIcon />
                          <span>Software</span>
                        </button>
                      </li>

                      <li className={styles.item} role="menuitem">
                        <button className={styles.row} type="button" onClick={() => handleOpenArchive("category=Graphic+Design")}>
                          <FolderIcon />
                          <span>Graphic Design</span>
                        </button>
                      </li>
                    </ul>
                  </li>

                  <li className={styles.separator} role="separator" />

                  <li className={styles.item} role="menuitem">
                    <a className={styles.row} href={`mailto:${user.email}`}>
                      <span className={styles.label}>
                        <Mail size={16} className={styles.rowIcon} />
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
          <div className={styles.rightIcons}>
          <ThemeButton />
          </div>
          <ClockClient />
        </div>
      </div>
    </div>
  );
}
