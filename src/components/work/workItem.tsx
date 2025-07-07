import { Project } from '@/lib/definitions';

type WorkItemProps = {
  project: Project;
};

export default function WorkItem({ project }: WorkItemProps) {
  return (
    <div>
      <h2>{project.title}</h2>
      <p>{project.description}</p>

      {/* Links */}
      <div>
        {project.links.map(({ url }, index) => (
          <a key={index} href={url} target="_blank" rel="noopener noreferrer">
            {new URL(url).hostname}
          </a>
        ))}
      </div>

      {/* Tools */}
      <div>
        {project.tags.map((tag, index) => (
          <span key={index}>{tag}</span>
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
