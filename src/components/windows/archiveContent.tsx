import type { Project } from '@/lib/definitions';
import ArchiveClient from '@/components/archive/archiveClient';
import Search from '@/components/archive/search';
import Pagination from '@/components/archive/pagination';
import CategorySidebar from '@/components/archive/sidebar';
import styles from '@/styles/archive/archivePage.module.css';

type Props = {
  projects: Project[];
  totalPages: number;
  categories: string[];
  tags: string[];
  query: string;
  category: string;
  tag: string;
};

export default function ArchiveContent({
  projects,
  totalPages,
  categories,
  tags,
  query,
  category,
  tag,
}: Props) {
  return (
    <div className={styles.archiveWindow}>
      <aside className={styles.archiveSidebar}>
        <Search placeholder="Search" />
        <CategorySidebar
          categories={categories}
          tags={tags}
          activeCategory={category}
          activeTag={tag}
        />
      </aside>

      <section className={styles.archiveMain}>
        <div className={styles.archiveContent}>
          <ArchiveClient
            projects={projects}
            categories={categories}
            searchTerm={query}
          />
        </div>
        <Pagination totalPages={totalPages} />
      </section>
    </div>
  );
}
