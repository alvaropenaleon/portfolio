'use client';
import Icon from './icon';
import WindowFrame from './windowFrame';
import { useWindowManager } from '@/components/desktop/windowManager';
import WindowShell from './windowShell';
import styles from '@/styles/desktop/windowFrame.module.css';
import { Project } from '@/lib/definitions';
import { useEffect } from 'react';
import { useWindowStore } from '@/store/windowStore';

type PreloadedData = {
  about: { bio: string };
  archive: {
    projects: Project[];
    totalPages: number;
    categories: string[];
    tags: string[];
    query: string;
    category: string;
    tag: string;
  };
};

type Props = {
  preload: PreloadedData;
};

export default function DesktopShell({ preload }: Props) {
  const { windows, open, close, bringToFront, moveWindow } = useWindowManager();
  const { clampAllToViewport } = useWindowStore();

  // Handle window resize (move clamping logic from store to component)
  useEffect(() => {
    const handleResize = () => {
      clampAllToViewport(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampAllToViewport]);

  // Initialize windows from URL path on mount (client-only)
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const rawId = pathParts[1]; // about or archive
    if (rawId === 'about' || rawId === 'archive') {
      const already = windows.find((w) => w.id === rawId);
      if (!already) {
        if (rawId === 'about') open('about', { payload: preload.about });
        if (rawId === 'archive') open('archive', { payload: preload.archive });
      }
    }
  }, [open, windows, preload]);

  return (
    <div className="desktop-root">
      <div className="icon-grid">
        <Icon label="Work" iconSrc="/smart-folder.png" onClick={() => open('archive', { payload: preload.archive, pathOverride: '/archive?page=1&category=Work' })} />
        <Icon label="Archive" iconSrc="/folder.png" onClick={() => open('archive', { payload: preload.archive })} />
        <Icon label="About" iconSrc="/paper.png" onClick={() => open('about', { payload: preload.about })} />
        <Icon label="Mail" iconSrc="/mail.png" onClick={() => { window.location.href = "mailto:alvleon@hotmail.com"; }} />
      </div>
      {windows.map(w => (
        <WindowFrame
          key={w.id}
          title={w.title || w.id}
          zIndex={w.z}
          style={{
            left: `${w.geom.left}px`,
            top: `${w.geom.top}px`,
            width: `${w.geom.width}px`,
            height: `${w.geom.height}px`,
          }}
          hidden={!w.open}
          className={
            w.id === 'archive' ? styles.archiveWindowFrame :
            w.id === 'about' ? styles.aboutWindowFrame : ''
          }
          onClose={() => close(w.id)}
          onFocus={() => bringToFront(w.id)}
          onMove={(geom) => moveWindow(w.id, geom)}
        >
          <WindowShell id={w.id} payload={w.payload} />
        </WindowFrame>
      ))}
    </div>
  );
}