// src/components/archive/archiveItem.tsx
import React from "react";
import { Project } from "@/lib/definitions";
import rowStyles from "@/styles/ui/row.module.css";
import styles from "@/styles/archive/archiveItem.module.css";
import Tag, { TagStack } from "@/components/ui/tag";
import { highlightText } from "@/lib/utils";
import Image from "next/image";
import clsx from "clsx";

type Props = {
  project: Project;
  searchTerm: string;
  onOpenProject?: (project: Project) => void;
  onHover?: () => void;
  onFocus?: () => void;
  className?: string;
};

function ArchiveItem({
  project,
  searchTerm,
  onOpenProject,
  onHover, 
  onFocus,
  className,
}: Props) {
  const matched =
    !!searchTerm &&
    project.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  return (
    <div
      tabIndex={0}
      data-archive-row
      className={clsx(rowStyles.row4col, className)}
      onClick={() => onOpenProject?.(project)}
      onMouseEnter={onHover}
      onFocus={onFocus ?? onHover}  
    >
      {/* col1: thumbnail */}
      <div className={rowStyles.col1}>
        <div className={styles.thumbnailWrapper}>
          <Image
            src={project.heroImage}
            alt={project.title}
            width={300}
            height={150}
            className={styles.thumbnail}
            quality={90}
          />
        </div>
      </div>

      {/* col2: title */}
      <div className={rowStyles.col2}>
        <p className={styles.title}>
          {highlightText(project.title, searchTerm)}
        </p>
      </div>

      {/* col3: tag dots */}
      <div className={rowStyles.col3}>
        <TagStack tags={project.tags} />
      </div>

        {/* Col 4 – tag names */}
        <div className={rowStyles.col5}>
            <div className={styles.tags}>
                {project.tags.map((t, i) => (
                <Tag key={t} label={t} withComma={i < project.tags.length - 1} />
                ))}
            </div>
            </div>


      {/* col5: snippet */}
      <div className={rowStyles.col4}>
        <p
          data-description
          className={clsx(styles.description, matched && styles.alwaysShow)}
        >
          {highlightText(project.description, searchTerm)}
        </p>
      </div>

      {/* col6: date */}
      <div className={rowStyles.col6}>
        <p className={styles.date}>{project.date}</p>
      </div>
    </div>
  );
}

export default React.memo(ArchiveItem);
