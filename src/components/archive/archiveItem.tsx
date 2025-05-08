import { Project } from '@/lib/definitions';
import stylesRow from '@/styles/ui/row.module.css';
import styles from '@/styles/archive/archiveItem.module.css';
import CategoryMapping from '@/components/ui/categoryMapping';
import Tag from '@/components/ui/tag';
import { highlightText } from '@/lib/utils';
import Image from 'next/image';
// import Link from 'next/link';

type ArchiveItemProps = {
    project: Project;
    searchTerm: string;
    onOpenProject?: (id: string) => void;
};

export default function ArchiveItem({ project, searchTerm, onOpenProject }: ArchiveItemProps) {
    const lowerDesc = project.description.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    const hasMatchInDescription = searchTerm.trim() !== '' && lowerDesc.includes(lowerSearch);
    const handleClick = () => {
        if (onOpenProject) {
            onOpenProject(project.id);
        }
    };

    return (
        <div data-archive-row className={stylesRow.row4col} onClick={handleClick} >


            {/* Image */}
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
            
            {/* Title, Description */}
            <div className={stylesRow.col2}>
                <h5>{highlightText(project.title, searchTerm)}</h5>

                
                <p data-description
                    className={`${styles.description} ${hasMatchInDescription ? styles.alwaysShow : ''
                        }`}>
                    {highlightText(project.description, searchTerm)}
                </p> 
                
            </div>

            {/* Categories */}
            <div className={stylesRow.col3}>
                {project.categories.map((category, index) => (
                    <CategoryMapping key={index} category={category} />
                ))}

            </div>

            {/* Tags */}
            <div className={stylesRow.col4}>
                <a data-sublink>{project.tools.map((tool, index) => (
                    <Tag key={index} label={tool} withComma={index < project.tools.length - 1}/>
                ))}</a>
            </div>

            {/* Date */}
            <p className={`${stylesRow.col5} ${styles.date}`}>{project.date}</p>

            {/* Links (col6) */}
            <div className={stylesRow.col6}>
            {project.links.filter(l => l.url).length > 0 && (
                <div className={styles.linkContainer}>
                <div className={styles.ellipsis}>…</div>
                <div className={styles.linkMenu}>
                    {project.links.map(({url,type}, i) =>
                    url && (
                        <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        >
                        {type==='code' ? 'View Code' : 'View Demo'}
                        </a>
                    )
                    )}
                </div>
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
