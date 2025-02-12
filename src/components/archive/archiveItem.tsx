import { Project } from '@/lib/definitions';
import styles from '@/styles/archive/archiveItem.module.css';

type ArchiveListProps = {
  project: Project;
};

export default function ArchiveItem({ project }: ArchiveListProps) {
  return (
    <div className={styles.archiveItem}>
      <p>{project.date}</p>

      {/* Categories */}
      <div>
        {project.categories.map((category, index) => (
          <span key={index}>{category}</span>
        ))}
      </div>

      <p>{project.title}</p>

      {/* Tools */}
      <div>
        {project.tools.map((tool, index) => (
          <span key={index}>{tool}</span>
        ))}
      </div>

      {/* Links */}
      <div>
        {project.links.map((link, index) => (
          <a key={index} href={link} target="_blank" rel="noopener noreferrer">
            {new URL(link).hostname}
          </a>
        ))}
      </div>
    </div>
  );
}
