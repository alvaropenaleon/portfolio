import { fetchFilteredProjects, fetchUser, fetchProjectCategories, ITEMS_PER_PAGE } from '@/lib/data';
import ArchiveList from '@/components/archive/archiveList';
import SidebarLayout from '@/components/ui/sidebarLayout';
import ArchiveControls from '@/components/archive/archiveControls';
import PaginationControls from '@/components/archive/paginationControls';


export default async function ArchivePage({
    searchParams,
  }: {
    searchParams?: {
      search?: string;
      page?: string;
      category?: string;
    };
  }) {
  const searchQuery = searchParams?.search || "";
  const currentPage = Number(searchParams?.page) || 1;
  const selectedCategory = searchParams?.category || "";

  // Fetch projects, user, and categories from the database
  const { projects, totalCount } = await fetchFilteredProjects(searchQuery, currentPage, selectedCategory);
  const user = await fetchUser();
  const categories = await fetchProjectCategories();
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (!projects) {
    return <p className="text-red-500">Project data not found.</p>;
  }

  const sidebarContent = (
    <>

    </>
  );

  return (
    <SidebarLayout sidebar={sidebarContent} user={user}>

      <ArchiveControls
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        categories={categories}
      />
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
