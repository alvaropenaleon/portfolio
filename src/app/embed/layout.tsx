import SyncToParent from '@/components/desktop/syncToParent';

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* Sends path → parent whenever it changes */}
      <SyncToParent />
    </>
  );
}
