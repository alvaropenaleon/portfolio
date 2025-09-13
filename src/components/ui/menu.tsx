"use client";

import { useState } from "react";
import styles from "@/styles/ui/menu.module.css";
import ThemeButton from "@/components/ui/themeButton";
import ClockClient from "../about/clockClient";
import Image from "next/image";

function FolderIcon({ size = 14 }: { size?: number }) {
    return (
      <Image
        src="/folder.png"
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        quality={100}
        style={{ objectFit: 'contain' }}
        className={styles.rowIcon}
      />
    );
}

export default function MenuBar({ user }: { user: { email: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`${styles.menuContainer} ${isOpen ? styles.expanded : ""}`}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className={styles.menuBar}>
        <div className={styles.leftGroup}>
        <h1 className={styles.logo}>🐱</h1>
          <h1 className={styles.logo}>Perfect Blue</h1>

          <button
            className={styles.menuText}
            onMouseEnter={() => setIsOpen(true)}
            onFocus={() => setIsOpen(true)}
            onClick={() => setIsOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            aria-controls="menudropdown"
            type="button"
          >
            Menu
          </button>
        </div>

        <div className={styles.rightGroup}>
          <div className={styles.rightIcons}>
            {/* <a href={`mailto:${user.email}`}><Mail size={15} /></a> */}
            <ThemeButton />
          </div>
          <ClockClient />
        </div>
      </div>

      {isOpen && (
        <nav id="menudropdown" className={styles.menuDropdown} aria-label="Main">
          <ul className={styles.menuList} role="menu">
            <li className={styles.item} role="menuitem">
              <a className={styles.row} href="/about">
                <span className={styles.label}>About</span>
              </a>
            </li>

            <li className={styles.item} role="menuitem">
              <a className={styles.row} href="/archive">
                <span className={styles.label}>Archive</span>
              </a>
            </li>

            <li className={styles.separator} role="separator" />

            {/* submenu (opens on hover) */}
            <li className={`${styles.item} ${styles.hasSubmenu}`} role="menuitem" tabIndex={-1}>
              <button className={styles.row} type="button">
                <span className={styles.label}>Recent Folders</span>
                <span className={styles.submenuGlyph} aria-hidden>▸</span>
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
                <span className={styles.label}>Contact</span>
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
