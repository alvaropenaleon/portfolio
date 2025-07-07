import React from 'react';
// import { Code, Link } from 'lucide-react';
import { Project } from '@/lib/definitions';
import stylesRow from '@/styles/ui/row.module.css';
import styles from '@/styles/archive/archiveItem.module.css';
// import CategoryMapping from '@/components/ui/categoryMapping';
import Tag, { TagStack } from "@/components/ui/tag";
import { highlightText } from '@/lib/utils';
import Image from 'next/image';

type ArchiveItemProps = {
    project: Project;
    searchTerm: string;
    onOpenProject?: (id: string) => void;
};

export default function ArchiveItem({
    project,
    searchTerm,
    onOpenProject,
}: ArchiveItemProps) {
    const lowerDesc = project.description.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    const hasMatchInDescription = searchTerm.trim() !== '' && lowerDesc.includes(lowerSearch);
    
    const handleClick = () => { 
        onOpenProject?.(project.id);
    };

    return (
        <div
            tabIndex={0}
            data-archive-row
            className={stylesRow.row4col}
            onClick={handleClick}
        >
            {/* Col 1: thumbnail */}
            <div className={stylesRow.col1}>
                <div className={styles.thumbnailWrapper}>
                    <Image
                        src={project.heroImage}
                        alt={project.title}
                        width={300}
                        height={150}
                        className={styles.thumbnail}
                        quality={100}
                    />
                </div>
            </div>

            {/* Col 2: title */}
            <div className={stylesRow.col2}>
                <p className={styles.title}>{highlightText(project.title, searchTerm)}</p>
            </div> 

            {/* Col 3  – tag dots */}
            <div className={stylesRow.col3}>
            <TagStack tags={project.tags} />
            </div>

            {/* Col 4 – tag names */}
            <div className={stylesRow.col5}>
            <div className={styles.tags}>
                {(project.tags ?? []).map((t, i) => (
                <Tag key={t} label={t} withComma={i < (project.tags?.length ?? 0) - 1} className={styles.tags} />
                ))}
            </div>
            </div>

            {/* Col 5: description with highlight */}
            <div className={stylesRow.col4}>
                <p
                        data-description
                        className={`${styles.description} ${hasMatchInDescription ? styles.alwaysShow : ''
                            }`}
                    >
                        {highlightText(project.description, searchTerm)}
                </p>
            </div>
            

            {/* Col 6: date */}
            <p className={`${stylesRow.col6} ${styles.date}`}>
                {project.date}
            </p>

            {/* Col 6: code/demo icons on hover
            <div className={stylesRow.col7}>
                {project.links
                    .filter((l) => l.url)
                    .map(({ url, type }, i) => (
                        <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.iconWrapper}
                            data-tooltip={type === 'code' ? 'Code' : 'Live'}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {type === 'code' ? (
                                <Code className={styles.linkIcon} />
                            ) : (
                                <Link className={styles.linkIcon} />
                            )}
                        </a>
                    ))}
            </div>
            */}
        </div>
    );
}
