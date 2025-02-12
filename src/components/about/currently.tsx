import styles from '@/styles/ui/row.module.css';

interface CurrentlyRowProps {
  type: string;
  title: string;
}

export default function CurrentlyRow({ type, title }: CurrentlyRowProps) {
  return (
    <div className={styles.row2col}>
      <p className={styles.col1}>{type}</p>
      <p className={styles.col2}></p>
      <p className={styles.col3}>{title}</p>
    </div>
  );
}
