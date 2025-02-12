import { fetchAllProjects } from '@/lib/data';
import ArchiveList from '@/components/archive/archiveList';

export default async function ArchivePage() {
  const projects = await fetchAllProjects();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Archive</h1>
      <ArchiveList projects={projects} />
    </main>
  );
}
