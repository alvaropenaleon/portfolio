import WorkItem from '@/components/work/workItem';
import { Project } from '@/lib/definitions';

type WorkListProps = {
  projects: Project[];
};

export default function WorkList({ projects }: WorkListProps) {
  return (
    <div>
      {projects.map((project) => (
        <WorkItem key={project.id} project={project} />
      ))}
    </div>
  );
}
