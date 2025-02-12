import { fetchAllProjects } from '@/lib/data';
import ArchiveList from '@/components/archive/archiveList';
import SidebarLayout from '@/components/ui/sidebarLayout';

export default async function ArchivePage() {
  const projects = await fetchAllProjects();

  if (!projects) {
    return <p className="text-red-500">Project data not found.</p>;
  }

  // Define sidebar content
  const sidebarContent = (
    <>
      <p>Category:</p>
    </>
  );

  return (
    <SidebarLayout sidebar={sidebarContent}>
      <h1>Archive</h1>
      <ArchiveList projects={projects} />
    </SidebarLayout>
  );
}
