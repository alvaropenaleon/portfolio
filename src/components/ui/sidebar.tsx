import styles from '@/styles/ui/sidebar.module.css';

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return <aside className={styles.sidebar}>{children}</aside>;
}