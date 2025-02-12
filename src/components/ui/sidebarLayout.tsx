// components/SidebarLayout.tsx
import styles from '@/styles/ui/layout.module.css';

interface SidebarLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function SidebarLayout({ children, sidebar }: SidebarLayoutProps) {
  return (
    <div className={sidebar ? styles.withSidebar : styles.fullWidth}>
      {sidebar && (
        <div className={styles.sidebar}>
          <div className={styles.sidebarBottom}>
            {sidebar}
          </div>
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
