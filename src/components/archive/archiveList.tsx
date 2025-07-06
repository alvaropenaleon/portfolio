import ArchiveItem from '@/components/archive/archiveItem';
import { Project } from '@/lib/definitions';
import styles from '@/styles/ui/row.module.css';
import layout from '@/styles/archive/archiveList.module.css';

type ArchiveListProps = {
    projects: Project[];
    searchTerm: string;
    onOpenProject?: (id: string) => void;
};

export default function ArchiveList({ projects, searchTerm, onOpenProject }: ArchiveListProps) {
    return (
      <div className={layout.archivePane}>
        {/* overlay header – NOT in scroller */}
        <div className={layout.headerRow}>
          <div className={layout.row}>
            <p className={styles.col1}></p>
            <p className={styles.col2}>Name</p>
            <p className={styles.col3}></p>
            <p className={styles.col5}>Tags</p>
            <p className={styles.col4}>Comments</p>
            <p className={styles.col6}>Date Added</p>
          </div>
        </div>
  
        {/* only this div scrolls */}
        <div className={layout.scroller}>
          {projects.map(p => (
            <ArchiveItem
              key={p.id}
              project={p}
              searchTerm={searchTerm}
              onOpenProject={onOpenProject}
            />
          ))}
        </div>
      </div>
    );
  }
  
