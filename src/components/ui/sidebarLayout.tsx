// components/SidebarLayout.tsx
import styles from '@/styles/ui/layout.module.css';
import MenuBar from '@/components/ui/menu';
import { User } from '@/lib/definitions'; 

interface SidebarLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  user: User;
}

export default function SidebarLayout({ children, sidebar, user }: SidebarLayoutProps) {
  return (
    <div className={sidebar ? styles.withSidebar : styles.fullWidth}>
      <MenuBar user={user} />
      { /* 1 Render grid template column: sidebar */}
      {sidebar && (
        <div className={styles.sidebar}>
          <div className={styles.sidebarBottom}>
            {sidebar}
          </div>
        </div>
      )}
      { /* 2 Render for grid template column: auto */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
