// app/(desktop)/archive/page.tsx
import {
    fetchFilteredProjects,
    fetchProjectCategories,
    fetchProjectTags,
    ITEMS_PER_PAGE,
  } from "@/lib/data";
  import ArchiveClient from "@/components/archive/archiveClient";
  import Search from "@/components/archive/search";
  import Pagination from "@/components/archive/pagination";
  import CategorySidebar from "@/components/archive/sidebar";
  import pageStyles from "@/styles/archive/archivePage.module.css";
  
  interface PageProps {
    searchParams: Promise<{
      query?: string;
      category?: string;
      tag?: string;
      page?: string;
      embed?: string;
    }>;
  }
  
  export const revalidate = 120;
  
  export default async function ArchivePage({ searchParams }: PageProps) {
    const sp = await searchParams;
    const query = sp.query ?? "";
    const category = sp.category ?? "";
    const tag = sp.tag ?? "";
    const currentPage = Number(sp.page) || 1;
  
    // fetch both projects *and* categories & tags
    const [{ projects, totalPages }, categories, tags] = await Promise.all([
      fetchFilteredProjects(query, category, tag, currentPage, ITEMS_PER_PAGE),
      fetchProjectCategories(),
      fetchProjectTags(),
    ]);
  
    return (
      <div className={pageStyles.archiveWindow}>
        <aside className={pageStyles.archiveSidebar}>
          <Search placeholder="Search archive…" />
          <CategorySidebar
            categories={categories}
            tags={tags}
            activeCategory={category}
            activeTag={tag}
          />
        </aside>
  
        <section className={pageStyles.archiveMain}>
          <div className={pageStyles.archiveContent}>
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
  