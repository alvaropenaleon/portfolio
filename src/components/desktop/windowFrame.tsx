import { CSSProperties, ReactNode } from 'react';
import styles from '@/styles/desktop/windowFrame.module.css';

interface Props {
  title: string;
  zIndex: number;
  children: ReactNode;           /* the <iframe> we pass in */
  onClose(): void;
  onFocus(): void;
  style?: CSSProperties;         /* geometry from WindowManager */
}

export default function WindowFrame({
  title,
  zIndex,
  children,
  onClose,
  onFocus,
  style,
}: Props) {
  return (
    <div
      className={styles.windowFrame}
      style={{ zIndex, ...style }}   /* width/height/top/left etc. */
      onMouseDown={onFocus}
    >
      {/* ─── Title bar ─── */}
      <div className={styles.titleBar}>
        <button className={styles.closeBtn} onClick={onClose} />
        <span>{title}</span>
      </div>

      {/* ─── Content ─── */}
      <div className={styles.windowContent}>{children}</div>
    </div>
  );
}
