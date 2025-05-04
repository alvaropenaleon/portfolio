// components/ui/Tag.tsx
import styles from '@/styles/ui/tag.module.css';

type TagProps = {
  label: string;
  withComma?: boolean;
};

export default function Tag({ label, withComma = false }: TagProps) {
  return (
    <>
      <span className={styles.tag}>{label}</span>
      {withComma && <span style={{ fontSize: "var(--font-sm)" }}>,&nbsp;</span>}
    </>
  );
}
