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
    project:  "Project Details",
    carousel: "Image Carousel",
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
        <Icon label="About"   iconSrc="/paper.png"  onDoubleClick={() => open('about')} />
        <Icon label="Archive" iconSrc="/folder.png" onDoubleClick={() => open('archive')} />
        {/* <Icon label="Work"    iconSrc="/folder.png" onDoubleClick={() => open('work')} /> */}
      </div>

      {/* ───── Windows ───── */}
      {windows.map(w => (
        <WindowFrame
          key={w.id}
          title={titles[w.id]}
          zIndex={w.z}
          style={w.geom}
          className={w.id === 'archive' ? styles.archiveWindowFrame : ''}
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
