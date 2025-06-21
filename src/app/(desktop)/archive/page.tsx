import { fetchFilteredProjects, fetchProjectCategories, ITEMS_PER_PAGE } from "@/lib/data";
import ArchiveClient from "@/components/archive/archiveClient";
import Search from "@/components/archive/search";
import Pagination from "@/components/archive/pagination";
import CategorySidebar from "@/components/archive/sidebar";
import pageStyles from "@/styles/archive/archivePage.module.css";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
    page?: string;
    embed?: string;
  }>;
}

export const revalidate = 120;

export default async function ArchivePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const query = sp.query ?? "";
  const category = sp.category ?? "";
  const currentPage = Number(sp.page) || 1;

  // fetch both projects *and* categories
  const [{ projects, totalPages }, categories] = await Promise.all([
    fetchFilteredProjects(query, category, currentPage, ITEMS_PER_PAGE),
    fetchProjectCategories(),
  ]);

  const content = (
    <div className={pageStyles.archiveWindow}>
      <aside className={pageStyles.archiveSidebar}>
      
        <CategorySidebar
          categories={categories}
          activeCategory={category}
        />
      </aside>

      <section className={pageStyles.archiveMain}>
      <Search placeholder="Search" />
        <Pagination totalPages={totalPages} />


        <div className={pageStyles.archiveContent}>
          <ArchiveClient
            projects={projects}
            searchTerm={query}
          />
        </div>
      </section>
    </div>
  );

  // embed vs desktop -> you can keep your existing logic
  const embed = sp.embed === "true" || sp.embed === "1";
  return embed ? content : content;
}
