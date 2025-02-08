import { fetchAllProjects } from '@/lib/data';
import WorkList from '@/ui/work/work-list';

export default async function WorkPage() {
  const projects = await fetchAllProjects(); 

  const selectedProjectIds = [
    "acd50b8c-9e99-4fb5-b388-b5ed5aa80d20",
    "7188a7c6-4d17-45f7-9469-ca5f31f9904c"
  ]; 

  const selectedProjects = projects.filter((p) => selectedProjectIds.includes(p.id));

  return (
    <main>
      <h1>Selected Work</h1>
      <WorkList projects={selectedProjects} />
    </main>
  );
}
