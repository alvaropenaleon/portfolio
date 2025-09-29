import Head from 'next/head';
import { WindowManagerProvider } from '@/components/desktop/windowManager';
import Sidebar from '@/components/ui/sidebar';
import Notifications from '@/components/about/notifications';
import type { ReactNode } from 'react';
// import MenuBar from '@/components/ui/menu';
import 'highlight.js/styles/github-dark.css';


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

      { /*
      <MenuBar user={{
              email: ''
          }}></MenuBar>
        */ }

      <WindowManagerProvider>
        {children}
      </WindowManagerProvider>

      <Sidebar>
        <Notifications />
      </Sidebar>
    </>
  );
}
