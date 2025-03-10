import { Project } from '@/lib/definitions';
import styles from '@/styles/ui/row.module.css';

type ArchiveListProps = {
  project: Project;
};

export default function ArchiveItem({ project }: ArchiveListProps) {
  return (
    <div className={styles.row5col}>
      <p className={styles.col1}>{project.date}</p>

      {/* Categories */}
      <div className={styles.col2}>
        {project.categories.map((category, index) => (
          <p key={index}>{category}</p>
        ))}
      </div>

      <p className={styles.col3}>{project.title}</p>

      {/* Tools */}
      <div className={styles.col4}>
        {project.tools.map((tool, index) => (
          <p key={index}>{tool}</p>
        ))}
      </div>

      {/* Links */}
      <div className={styles.col5}>
        {project.links.map(({ url, type }, index) => (
          <a key={index} href={url} target="_blank" rel="noopener noreferrer">
            {type === 'code' ? 'Code' : 'Demo'}
          </a>
        ))}
      </div>
    </div>
  );
}
