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
            <p className={styles.col1}>Thumbnail</p>
            <p className={styles.col2}>Project</p>
            <p className={styles.col3}>Category</p>
            <p className={styles.col4}>Date Added</p>
            <p className={styles.col5} />
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
  
