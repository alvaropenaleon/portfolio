import { CSSProperties, ReactNode } from 'react';
import styles from '@/styles/desktop/windowFrame.module.css';

interface Props {
  title: string;
  zIndex: number;
  children: ReactNode;
  onClose(): void;
  onFocus(): void;
  style?: CSSProperties;   // geometry from WindowManager
  hidden?: boolean;        // ← NEW
}

export default function WindowFrame({
  title,
  zIndex,
  children,
  onClose,
  onFocus,
  style,
  hidden = false,
}: Props) {
  return (
    <div
      className={styles.windowFrame}
      style={{
        display: hidden ? 'none' : 'flex',  // hide until iframe loads
        zIndex,
        ...style,
      }}
      onMouseDown={onFocus}
    >
      {/* ───── Title bar ───── */}
      <div className={styles.titleBar}>
        <button className={styles.closeBtn} onClick={onClose} />
        <span>{title}</span>
      </div>

      {/* ───── Content ───── */}
      <div className={styles.windowContent}>{children}</div>
    </div>
  );
}
