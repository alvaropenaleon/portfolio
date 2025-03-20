import ArchiveItem from '@/components/archive/archiveItem';
import { Project } from '@/lib/definitions';
import styles from '@/styles/ui/row.module.css';
import layoutStyles from '@/styles/archive/archiveList.module.css'; 

type ArchiveListProps = {
  projects: Project[];
  searchTerm: string;
};

export default function ArchiveList({ projects, searchTerm }: ArchiveListProps) {
  return (
    <div>
      {/* header */}
      <div className={layoutStyles.stickyHeader}>
        <div className={styles.row4col}>
          <p className={styles.col1}>Date</p>
          <p className={styles.col2}>Project</p>
          <p className={styles.col3}>Skillset</p>
          <p className={styles.col4}>Link</p>
        </div>
      </div>

      {/* list items */}
      {projects.map((project) => (
        <ArchiveItem key={project.id} project={project} searchTerm={searchTerm}/>
      ))}
    </div>
  );
}
