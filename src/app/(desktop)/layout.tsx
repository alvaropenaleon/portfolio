// app/(desktop)/layout.tsx
import Head from 'next/head';                          // ← ADD this import
import DesktopView         from '@/components/desktop/desktopView';
import { WindowManagerProvider } from '@/components/desktop/windowManager';
import Sidebar             from '@/components/ui/sidebar';
import Notifications       from '@/components/about/notifications';

export default function DesktopLayout() {
  return (
    <>

    <Head>
        {/* Warm up the browser cache for those routes without running entire js */}
        <link rel="prefetch" href="/embed/archive" as="document" />
        <link rel="prefetch" href="/embed/about"   as="document" />
      </Head>
      
      <WindowManagerProvider>
        <DesktopView />   {/* no more {children} – windows are handled internally */}
      </WindowManagerProvider>

      <Sidebar>
        <Notifications />
      </Sidebar>
    </>
  );
}
