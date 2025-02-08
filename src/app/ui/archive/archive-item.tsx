import { Project } from '@/app/lib/definitions';

type ArchiveListProps = {
  project: Project;
};

export default function ArchiveItem({ project }: ArchiveListProps) {
  return (
    <div>
      <h2>{project.title}</h2>
      <p>{project.date}</p>

      {/* Links */}
      <div>
        {project.links.map((link, index) => (
          <a key={index} href={link} target="_blank" rel="noopener noreferrer">
            {new URL(link).hostname}
          </a>
        ))}
      </div>

      {/* Tools */}
      <div>
        {project.tools.map((tool, index) => (
          <span key={index}>{tool}</span>
        ))}
      </div>

      {/* Categories */}
      <div>
        {project.categories.map((category, index) => (
          <span key={index}>{category}</span>
        ))}
      </div>
    </div>
  );
}
