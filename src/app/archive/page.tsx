import { fetchFilteredProjects, fetchUser, ITEMS_PER_PAGE } from '@/lib/data';
import ArchiveList from '@/components/archive/archiveList';
import SidebarLayout from '@/components/ui/sidebarLayout';
import ArchiveControls from '@/components/archive/archiveControls';
import PaginationControls from '@/components/archive/paginationControls';


type ArchivePageProps = {
    searchParams: {
        search?: string;
        page?: string;
        category?: string;
    };
};


export default async function ArchivePage({ searchParams}: ArchivePageProps) {

  const searchQuery = searchParams.search || "";
  const currentPage = Number(searchParams.page) || 1;
  const selectedCategory = searchParams.category || "";

  // const projects = await fetchAllProjects();
  const { projects, totalCount } = await fetchFilteredProjects(searchQuery, currentPage, selectedCategory);
  const user = await fetchUser();
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (!projects) {
    return <p className="text-red-500">Project data not found.</p>;
  }

  // Sidebar content
  const sidebarContent = (
    <>
    
    </>
  );

  return (
    <SidebarLayout sidebar={sidebarContent} user={user}>
      <h1>Archive</h1>

      <ArchiveControls searchQuery={searchQuery} selectedCategory={selectedCategory} />

      <ArchiveList projects={projects} />

      <PaginationControls
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </SidebarLayout>
  );
}
