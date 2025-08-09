import Head from 'next/head';
import { WindowManagerProvider } from '@/components/desktop/windowManager';
import Sidebar from '@/components/ui/sidebar';
import Notifications from '@/components/about/notifications';
import type { ReactNode } from 'react';

export default function DesktopLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <Head>
        {/* Warm up the browser cache for key routes (no iframe usage anymore) */}
        <link rel="prefetch" href="/about" as="document" />
        <link rel="prefetch" href="/archive" as="document" />
      </Head>

      <WindowManagerProvider>
        {children}
      </WindowManagerProvider>

      <Sidebar>
        <Notifications />
      </Sidebar>
    </>
  );
}
