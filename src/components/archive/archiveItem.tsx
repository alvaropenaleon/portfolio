import React, { useState, useRef, useEffect } from 'react';
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

    const [menuOpen, setMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // toggle menu on ellipsis click
    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMenuOpen((open) => !open);
    };

    useEffect(() => {
        // run in capture phase so we can stop row-level clicks
        const onDocumentClickCapture = (e: Event) => {
            if (
                menuOpen &&
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setMenuOpen(false);
                // prevent the click from reaching the row's onClick
                e.stopImmediatePropagation();
            }
        };

        const onScrollCapture = () => {
            if (menuOpen) {
                setMenuOpen(false);
            }
        };

        document.addEventListener(
            'click',
            onDocumentClickCapture,
      /* useCapture= */ true
        );
        window.addEventListener('scroll', onScrollCapture, /* useCapture= */ true);

        return () => {
            document.removeEventListener(
                'click',
                onDocumentClickCapture,
        /* useCapture= */ true
            );
            window.removeEventListener(
                'scroll',
                onScrollCapture,
        /* useCapture= */ true
            );
        };
    }, [menuOpen]);

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
                <h5>{highlightText(project.title, searchTerm)}</h5>
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

            {/* Col 6: click-to-open menu */}
            <div className={stylesRow.col6}>
                {project.links.some((l) => l.url) && (
                    <div className={styles.linkContainer} ref={containerRef}>
                        <div className={styles.ellipsis} onClick={toggleMenu}>
                            …
                        </div>

                        {menuOpen && (
                            <div className={styles.linkMenu}>
                                {project.links.map(
                                    ({ url, type }, i) =>
                                        url && (
                                            <a
                                                key={i}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {type === 'code' ? 'View Code' : 'View Demo'}
                                            </a>
                                        )
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/*
            <Link href={`/project/${project.id}`}>
                <span className={styles.fullLinkOverlay} aria-label={`View project ${project.title}`} />
            </Link>
            */}
        </div>
    );
}
