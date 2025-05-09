// components/ui/Tag.tsx
import styles from '@/styles/ui/tag.module.css';

type TagProps = {
  label: string;
  withComma?: boolean;
};

export default function Tag({ label, withComma = false }: TagProps) {
  return (
    <>
      <p className={styles.tag}>{label}</p>
      {withComma && <span style={{ color: "rgba(var(--color-foreground-rgb), 0.7)", fontSize: "var(--font-sm)" }}>,&nbsp;</span>}
    </>
  );
}
