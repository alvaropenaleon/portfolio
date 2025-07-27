'use client';

import Icon         from './icon';
import WindowFrame  from './windowFrame';
import { useWindowManager } from './windowManager';
import styles from '@/styles/desktop/windowFrame.module.css';
import type { WindowID } from "./windowManager";


const titles: Record<WindowID, string> = {
    about:    "About Me",
    archive:  "Archive",
    work:     "Work",
  } as const;

export default function DesktopView() {
  const {
    windows,
    open,
    close,
    bringToFront,
    markLoaded,
    moveWindow,
  } = useWindowManager();

  return (
    <div className="desktop-root">
      {/* ───── Icons ───── */}
      <div className="icon-grid">
        <Icon label="Work"    iconSrc="/smart-folder.png" onClick={() => open('archive', { category: 'Work' })} />
        <Icon label="Archive" iconSrc="/folder.png" onClick={() => open('archive')} />
        <Icon label="About"   iconSrc="/paper.png"  onClick={() => open('about')} />
        <Icon label="Mail"   iconSrc="/mail.png"  onClick={() => {window.location.href = "mailto:alvleon@hotmail.com";}} />

        

      </div>

      {/* ───── Windows ───── */}
      {windows.map(w => (
        <WindowFrame
          key={w.id}
          title={w.dynamicTitle ?? titles[w.id]}
          zIndex={w.z}
          style={w.geom}
          className={
            w.id === 'archive' ? styles.archiveWindowFrame :
            w.id === 'about'   ? styles.aboutWindowFrame   :
             ''}
          onClose={() => close(w.id)}
          onFocus={() => bringToFront(w.id)}
          onMove={(geom) => moveWindow(w.id, geom)}
          hidden={!w.visible}          /* hide until iframe loads */
        >
          <iframe
            src={`/embed${w.path}`}     /* real route ⇒ full CSS + JS */
            className={styles.fillFrame}
            onLoad={() => markLoaded(w.id)}
          />
        </WindowFrame>
      ))}
    </div>
  );
}
