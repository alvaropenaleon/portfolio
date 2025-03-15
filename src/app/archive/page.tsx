// app/archive/page.tsx

import { fetchFilteredProjects, fetchUser,  ITEMS_PER_PAGE } from '@/lib/data';
import ArchiveList from '@/components/archive/archiveList';
import SidebarLayout from '@/components/ui/sidebarLayout';
import Search from '@/components/archive/search';
import Pagination from '@/components/archive/pagination';

// 1) Define searchParams as a Promise
interface ArchivePageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  // 2) Await searchParams
  const sp = await searchParams;

  // 3) Now read query/page from the awaited object
  const query = sp.query ?? '';
  const currentPage = Number(sp.page) || 1;

  // Fetch user + filtered projects
  const user = await fetchUser();
  const { projects, totalPages } = await fetchFilteredProjects(query, currentPage,  ITEMS_PER_PAGE);

  // Sidebar, etc.
  const sidebarContent = <p>Category:</p>;

  return (
    <SidebarLayout sidebar={sidebarContent} user={user}>
      <Search placeholder="Search projects..." />
      <ArchiveList projects={projects} />
      <Pagination totalPages={totalPages} />
    </SidebarLayout>
  );
}
