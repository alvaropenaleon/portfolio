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
