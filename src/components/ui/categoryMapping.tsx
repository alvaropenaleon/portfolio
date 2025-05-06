import styles from '@/styles/ui/category.module.css';

type CategoryColorDotProps = {
  category: string;
};

export default function CategoryColorDot({ category }: CategoryColorDotProps) {
  const categoryColors: Record<string, string> = {
    Artwork: "var(--brand-red )",
    Backend: "var(--brand-pink)",
    "Data Science": "var(--brand-purple)",
    Frontend: "var(--brand-green)",
    "Graphic Design": "var(--brand-turquoise)",
    Systems: "var(--brand-yellow)",
    Writing: "var(--brand-navy)",
  };

  const color = categoryColors[category] || "var(--brand-grey)";

  return (
    <div className={styles.category}>
      <span
        className={styles.dot}
        style={{ backgroundColor: color }}
        title={category} 
      />
      {/*<span className={styles.label}>{category}</span>*/}
    </div>
  );
}
