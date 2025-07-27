// app/(desktop)/layout.tsx
import DesktopView         from '@/components/desktop/desktopView';
import { WindowManagerProvider } from '@/components/desktop/windowManager';
import Sidebar             from '@/components/ui/sidebar';
import Notifications       from '@/components/about/notifications';

export default function DesktopLayout() {
  return (
    <>

      {/* Warm‑up iframes (hidden) */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <iframe src="/embed/archive" />
        <iframe src="/embed/about" />
      </div>
      
      <WindowManagerProvider>
        <DesktopView />   {/* no more {children} – windows are handled internally */}
      </WindowManagerProvider>

      <Sidebar>
        <Notifications />
      </Sidebar>
    </>
  );
}
