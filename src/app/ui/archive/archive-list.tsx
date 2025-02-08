import ArchiveItem from '@/app/ui/archive/archive-item';
import { Project } from '@/app/lib/definitions';

type ArchiveListProps = {
  projects: Project[];
};

export default function ArchiveList({ projects }: ArchiveListProps) {
  return (
    <div>
      {projects.map((project) => (
        <ArchiveItem key={project.id} project={project} />
      ))}
    </div>
  );
}
