import { Project } from '@/lib/definitions';
import stylesRow from '@/styles/ui/row.module.css';
import styles from '@/styles/archive/archiveItem.module.css';
import CategoryMapping from '@/components/ui/categoryMapping';
import Tag from '@/components/ui/tag';
import { highlightText } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import ViewItem from '@/components/archive/viewItem';

type ArchiveItemProps = {
    project: Project;
    searchTerm: string;
};

export default function ArchiveItem({ project, searchTerm }: ArchiveItemProps) {
    const lowerDesc = project.description.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    const hasMatchInDescription = searchTerm.trim() !== '' && lowerDesc.includes(lowerSearch);

    return (
        <div  data-archive-row className={stylesRow.row4col}>

            {/* Date */}
            <p className={stylesRow.col1}>{project.date}</p>

            {/* Title, Description, Categories */}
            <div className={stylesRow.col2}>
                <h3>{highlightText(project.title, searchTerm)}</h3>

                <p data-description className={`${styles.description} ${hasMatchInDescription ? styles.alwaysShow : ''
                    }`}>
                    {highlightText(project.description, searchTerm)}
                </p>

                {project.categories.map((category, index) => (
                    <CategoryMapping key={index} category={category} />
                ))}
            </div>

            {/* Tools */}
            <div className={stylesRow.col3}>
                {project.tools.map((tool, index) => (
                    <Tag key={index} label={tool} />
                ))}
            </div>

            {/* Links */}
            <div className={stylesRow.col4}>
                {project.links.map(({ url, type }, index) => (
                    url ? (
                        <a data-sublink className={styles.link} key={index} href={url} target="_blank" rel="noopener noreferrer">
                            {type === 'code' ? 'Code' : 'Demo'}
                        </a>
                    ) : null
                ))}
            </div>

            {/* Image */}
            <div data-image className={styles.hiddenImage}>
                <div className={styles.imageInner}>
                    <Image
                        src={project.heroImage}
                        alt={project.title}
                        layout="fill"
                        objectFit="contain"
                        quality={65}
                    />
                </div>
            </div>

            <Link href={`/project/${project.id}`}>
                <span className={styles.fullLinkOverlay} aria-label={`View project ${project.title}`} />
            </Link>

            <ViewItem />

        </div>
    );
}
