import React from 'react';
import { Code, Link2 } from 'lucide-react';
import { Project } from '@/lib/definitions';
import stylesRow from '@/styles/ui/row.module.css';
import styles from '@/styles/archive/archiveItem.module.css';
import CategoryMapping from '@/components/ui/categoryMapping';
import Tag from '@/components/ui/tag';
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
    const hasMatchInDescription =
        searchTerm.trim() !== '' && lowerDesc.includes(lowerSearch);

    const handleClick = () => {
        onOpenProject?.(project.id);
    };

    return (
        <div
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

            {/* Col 2: title & description */}
            <div className={stylesRow.col2}>
                <p><b>{highlightText(project.title, searchTerm)}</b></p>
                <p
                    data-description
                    className={`${styles.description} ${hasMatchInDescription ? styles.alwaysShow : ''
                        }`}
                >
                    {highlightText(project.description, searchTerm)}
                </p>
            </div>

            {/* Col 3: categories */}
            <div className={stylesRow.col3}>
                {project.categories.map((c, i) => (
                    <CategoryMapping key={i} category={c} />
                ))}
            </div>

            {/* Col 4: tags */}
            <div className={stylesRow.col4}>
                <a data-sublink>
                    {project.tools.map((tool, i) => (
                        <Tag
                            key={i}
                            label={tool}
                            withComma={i < project.tools.length - 1}
                        />
                    ))}
                </a>
            </div>

            {/* Col 5: date */}
            <p className={`${stylesRow.col5} ${styles.date}`}>
                {project.date}
            </p>

            {/* Col 6: code/demo icons on hover */}
            <div className={stylesRow.col6}>
                {project.links
                    .filter((l) => l.url)
                    .map(({ url, type }, i) => (
                        <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.iconWrapper}
                            data-tooltip={type === 'code' ? 'View Code' : 'View Demo'}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {type === 'code' ? (
                                <Code className={styles.linkIcon} />
                            ) : (
                                <Link2 className={styles.linkIcon} />
                            )}
                        </a>
                    ))}
            </div>
        </div>
    );
}
