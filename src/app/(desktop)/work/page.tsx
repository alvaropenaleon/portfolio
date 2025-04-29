import { fetchProjectById } from '@/lib/data';
import WorkList from '@/components/work/workList';

export default async function WorkPage() {
  const selectedProjectIds = [
    "acd50b8c-9e99-4fb5-b388-b5ed5aa80d20",
    "7188a7c6-4d17-45f7-9469-ca5f31f9904c"
  ];

  const selectedProjects = await fetchProjectById(selectedProjectIds);

  return (
    <main>
      <h1>Selected Work</h1>
      <WorkList projects={selectedProjects} />
    </main>
  );
}