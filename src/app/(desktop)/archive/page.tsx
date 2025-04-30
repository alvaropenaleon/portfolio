// app/(desktop)/archive/page.tsx
import { fetchFilteredProjects, ITEMS_PER_PAGE } from '@/lib/data';
import ArchiveClient   from '@/components/archive/archiveClient';
import Search          from '@/components/archive/search';
import Pagination      from '@/components/archive/pagination';

interface PageProps {
    searchParams: Promise<{
        query?: string;
        page?: string;
        embed?: string;
    }>;
}


export const revalidate = 120;

export default async function ArchivePage({ searchParams }: PageProps) {
    const sp = await searchParams;

    const query = sp.query ?? '';
    const embed = sp.embed === 'true' || sp.embed === '1';
    const currentPage = Number(sp.page) || 1;

  const { projects, totalPages } = await fetchFilteredProjects(
    query,
    currentPage,
    ITEMS_PER_PAGE
  );

  /* -------- inner UI -------- */
  const content = (
    <>
      <Search />
      <ArchiveClient projects={projects} searchTerm={query} />
      <Pagination totalPages={totalPages} />
    </>
  );

  /* If we’re inside the iframe just return raw content */
  if (embed) return content;

  /* Otherwise let the normal Desktop layout wrap it */
  return content;
}
