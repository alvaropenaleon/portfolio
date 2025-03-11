import { Project } from '@/lib/definitions';
import styles from '@/styles/ui/row.module.css';
import CategoryMapping from '@/components/ui/categoryMapping';


type ArchiveListProps = {
    project: Project;
};

export default function ArchiveItem({ project }: ArchiveListProps) {
    return (
        <div className={styles.row4col}>
            <p className={styles.col1}>{project.date}</p>

            {/* Categories */}
            <div className={styles.col2}>
                {project.title}
                <br />
                {project.categories.map((category, index) => (
                    <CategoryMapping key={index} category={category} />
                ))}
            </div>

            {/* Tools */}
            <div className={styles.col3}>
                {project.tools.map((tool, index) => (
                    <p key={index}>{tool}</p>
                ))}
            </div>

            {/* Links */}
            <div className={styles.col4}>
                {project.links.map(({ url, type }, index) => (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                        {type === 'code' ? 'Code' : 'Demo'}
                    </a>
                ))}
            </div>
        </div>
    );
}
