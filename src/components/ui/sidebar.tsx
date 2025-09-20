'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/ui/sidebar.module.css';

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onToggle: EventListener = () => setOpen( prev => !prev );
        const onCloseKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        window.addEventListener('toggleSidebar', onToggle);
        if (open) window.addEventListener('keydown', onCloseKey);
        return () => {
            window.removeEventListener('toggleSidebar', onToggle);
            window.removeEventListener('keydown', onCloseKey);
        }
    }, [open]);
    
    return (
        <>
          <div
            className={`${styles.overlay} ${open ? styles.open : ""}`}
            onClick={() => setOpen(false)}
            aria-hidden={!open}
          />
          <aside
            className={`${styles.sidebar} ${open ? styles.open : ""}`}
            role="complementary"
            aria-hidden={!open}
          >
            {children}
          </aside>
        </>
      );
    }