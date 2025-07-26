// src/components/desktop/icon.tsx
import styles from "@/styles/desktop/icon.module.css";
import Image from 'next/image';

interface IconProps {
  label: string;
  iconSrc: string;
  onDoubleClick: () => void;
}

export default function Icon({ label, iconSrc, onDoubleClick }: IconProps) {
  return (
    <div className={styles.icon} onDoubleClick={onDoubleClick}>
      <Image
        src={iconSrc}
        alt={label}
        width={60}
        height={60}
        style={{ objectFit: 'contain' }}
        priority
      />
      <div className={styles.label}>{label}</div>
    </div>
  );
}

  