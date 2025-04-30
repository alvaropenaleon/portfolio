'use client';

import Icon        from './icon';
import WindowFrame from './windowFrame';
import { useWindowManager }   from './windowManager';
import styles from '@/styles/desktop/windowFrame.module.css';


const titles = {
  about:   'About Me',
  archive: 'Archive',
  work:    'Work',
} as const;

export default function DesktopView() {
  const { windows, open, close, bringToFront } = useWindowManager();

  return (
    <div className="desktop-root">
      {/* ─────────── Icons ─────────── */}
      <div className="icon-grid">
        <Icon label="About"   iconSrc="/paper.png"
              onDoubleClick={() => open('about')} />

        <Icon label="Archive" iconSrc="/folder.png"
              onDoubleClick={() => open('archive')} />

        <Icon label="Work"    iconSrc="/hammer.png"
              onDoubleClick={() => open('work')} />
      </div>

      {/* ────────── Windows ────────── */}
      {windows.map(w => (
        <WindowFrame
          key={w.id}
          title={titles[w.id]}
          zIndex={w.z}
          style={w.geom}                    // ← custom size / position
          onClose={() => close(w.id)}
          onFocus={() => bringToFront(w.id)}
        >
          <iframe
            src={`/embed/${w.id}`}
            className={styles.fillFrame}
          />
        </WindowFrame>
      ))}
    </div>
  );
}
