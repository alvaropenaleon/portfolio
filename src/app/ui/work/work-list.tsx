import WorkItem from '@/app/ui/work/work-item';
import { Project } from '@/app/lib/definitions';

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
