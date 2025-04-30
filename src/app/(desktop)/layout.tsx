// app/(desktop)/layout.tsx
import DesktopView         from '@/components/desktop/desktopView';
import { WindowManagerProvider } from '@/components/desktop/windowManager';
import Sidebar             from '@/components/ui/sidebar';
import Notifications       from '@/components/about/notifications';

export default function DesktopLayout() {
  return (
    <>
      <WindowManagerProvider>
        <DesktopView />   {/* no more {children} – windows are handled internally */}
      </WindowManagerProvider>

      <Sidebar>
        <Notifications />
      </Sidebar>
    </>
  );
}
