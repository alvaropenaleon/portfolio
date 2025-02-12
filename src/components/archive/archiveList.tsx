import ArchiveItem from '@/components/archive/archiveItem';
import { Project } from '@/lib/definitions';

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
