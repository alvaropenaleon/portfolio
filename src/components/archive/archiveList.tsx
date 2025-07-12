import { useEffect, useRef, useState } from "react";

import ArchiveItem from '@/components/archive/archiveItem';
import { Project } from '@/lib/definitions';
import styles from '@/styles/ui/row.module.css';
import layout from '@/styles/archive/archiveList.module.css';

const ROW_H = 36;  // height of one row in viewport units (1.5rem)

type ArchiveListProps = {
    projects: Project[];
    searchTerm: string;
    onOpenProject?: (id: string) => void;
};

export default function ArchiveList({ projects, searchTerm, onOpenProject }: ArchiveListProps) {

    const scrollRef  = useRef<HTMLDivElement>(null);
    const [placeCnt, setPlaceCnt] = useState(0);
  
    /*  measure viewport height and compute empty rows  */
    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
  
      const ro = new ResizeObserver(() => {
        const rowsFit   = Math.ceil(el.clientHeight / ROW_H);
        const blanks    = Math.max(rowsFit - projects.length, 0);
        setPlaceCnt(blanks);
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [projects.length]);

    return (
      <div className={layout.archivePane}>
        {/* header row (non-scrolling) */}
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
  
        {/*  scroll area */}
        <div className={layout.scroller} ref={scrollRef}>
          {projects.map(p => (
            <ArchiveItem
              key={p.id}
              project={p}
              searchTerm={searchTerm}
              onOpenProject={onOpenProject}
            />
          ))}

        {/* placeholder rows (just empty <div> blocks) */}
        {Array.from({ length: placeCnt }).map((_, i) => (
          <div
            key={`ph-${i}`}
            className={styles.row4col}
            aria-hidden="true"
          />
        ))}

        </div>
      </div>
    );
  }
  
