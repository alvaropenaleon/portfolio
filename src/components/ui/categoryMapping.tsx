import styles from '@/styles/ui/category.module.css';

type CategoryColorDotProps = {
  category: string;
};

export default function CategoryColorDot({ category }: CategoryColorDotProps) {
  const categoryColors: Record<string, string> = {
    Artwork: "var(--tag-red )",
    Backend: "var(--tag-orange)",
    "Data Science": "var(--tag-purple)",
    Frontend: "var(--tag-green)",
    "Graphic Design": "var(--tag-blue)",
    Systems: "var(--tag-yellow)",
    Writing: "var(--tag-grey)",
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
