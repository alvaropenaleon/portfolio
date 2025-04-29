// src/components/Desktop/Icon.tsx
// src/components/desktop/icon.tsx
import Image from 'next/image';

interface IconProps {
  label: string;
  iconSrc: string;
  onDoubleClick: () => void;
}

export default function Icon({ label, iconSrc, onDoubleClick }: IconProps) {
  return (
    <div className="icon" onDoubleClick={onDoubleClick}>
      <Image
        src={iconSrc}
        alt={label}
        width={64}
        height={64}
        priority
      />
      <div className="icon-label">{label}</div>
    </div>
  );
}

  