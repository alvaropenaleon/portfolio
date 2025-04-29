// src/components/desktop/DesktopView.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/desktop/icon';
import WindowFrame from '@/components/desktop/windowFrame';

const titleMap: Record<string, string> = {
  '/about':   'About Me',
  '/archive': 'Archive',
  '/work':    'Work',
};

export default function DesktopView({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const path   = usePathname();
  const title  = titleMap[path];

  return (
    <div className="desktop-root">
      {/* ICON GRID */}
      <div className="icon-grid">
        <Icon label="About"   iconSrc="/paper.png"  onDoubleClick={() => router.push('/about')} />
        <Icon label="Archive" iconSrc="/folder.png" onDoubleClick={() => router.push('/archive')} />
        {/* etc. */}
      </div>

      {/* ROUTE-DRIVEN WINDOW */}
      {children && (
        <WindowFrame
          title={title}
          onClose={() => router.push('/')}
          onFocus={() => {/* optionally re-push(path) to keep in front */}}
        >
          {children}
        </WindowFrame>
      )}
    </div>
  );
}
