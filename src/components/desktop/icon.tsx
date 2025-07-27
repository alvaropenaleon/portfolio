// src/components/desktop/icon.tsx
import styles from "@/styles/desktop/icon.module.css";
import Image from 'next/image';

interface IconProps {
  label: string;
  iconSrc: string;
  onClick: () => void;
}

export default function Icon({ label, iconSrc, onClick }: IconProps) {
  return (
    <div className={styles.iconContainer}>
    <div className={styles.icon} onClick={onClick}>
      <Image
        src={iconSrc}
        alt={label}
        width={62}
        height={62}
        quality={100}
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
       <div className={styles.label}>{label}</div>
    </div>
  );
}

  