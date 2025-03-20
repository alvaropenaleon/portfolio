import { Project } from '@/lib/definitions';
import styles from '@/styles/ui/row.module.css';
import style from '@/styles/archive/archiveItem.module.css';
import CategoryMapping from '@/components/ui/categoryMapping';
import Tag from '@/components/ui/tag';
import { highlightText } from '@/lib/utils';

type ArchiveItemProps = {
    project: Project;
    searchTerm: string;
};

export default function ArchiveItem({ project, searchTerm }: ArchiveItemProps) {
    return (
        <div className={styles.row4col}>
            <p className={styles.col1}>{project.date}</p>

            {/* Title, Description, Categories */}
            <div className={styles.col2}>
                <h3>{highlightText(project.title, searchTerm)}</h3>
                
                <p>{highlightText(project.description, searchTerm)}</p>

                {project.categories.map((category, index) => (
                    <CategoryMapping key={index} category={category} />
                ))}
            </div>

            {/* Tools */}
            <div className={styles.col3}>
                {project.tools.map((tool, index) => (
                    <Tag key={index} label={tool} />
                ))}
            </div>

            {/* Links */}
            <div className={styles.col4}>
                {project.links.map(({ url, type }, index) => (
                    url ? (
                        <a className={style.link} key={index} href={url} target="_blank" rel="noopener noreferrer">
                            {type === 'code' ? 'Code' : 'Demo'}
                        </a>
                    ) : null
                ))}
            </div>
        </div>
    );
}
