// app/(desktop)/layout.tsx
import DesktopView from '@/components/desktop/desktopView';
import Sidebar from '@/components/ui/sidebar';
import Notifications from '@/components/about/notifications'; // your async server component

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 1) Render your desktop icons & windows client‐side */}
      <DesktopView>{children}</DesktopView>

      {/* 2) Render a fixed sidebar with server‐fetched notifications */}
      <Sidebar>
        <Notifications />
      </Sidebar>
    </>
  );
}
