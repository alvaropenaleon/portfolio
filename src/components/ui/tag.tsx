import styles from '@/styles/ui/tag.module.css';

type TagProps = {
  label: string;
};

export default function Tag({ label }: TagProps) {
  return <span className={styles.tag}>{label}</span>;
}
