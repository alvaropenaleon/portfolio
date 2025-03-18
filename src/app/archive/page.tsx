import { fetchFilteredProjects, fetchUser,  ITEMS_PER_PAGE } from '@/lib/data';
import ArchiveList from '@/components/archive/archiveList';
import SidebarLayout from '@/components/ui/sidebarLayout';
import Search from '@/components/archive/search';
import Pagination from '@/components/archive/pagination';

interface ArchivePageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const sp = await searchParams;

  // Read query/page
  const query = sp.query ?? '';
  const currentPage = Number(sp.page) || 1;

  const user = await fetchUser();
  const { projects, totalPages } = await fetchFilteredProjects(query, currentPage,  ITEMS_PER_PAGE);

  const sidebarContent = (
    <></>
  );
  
  return (
    <SidebarLayout sidebar={sidebarContent} user={user}>
      <Search placeholder="Search projects..." />
      <ArchiveList projects={projects} />
      <Pagination totalPages={totalPages} />
    </SidebarLayout>
  );
}
