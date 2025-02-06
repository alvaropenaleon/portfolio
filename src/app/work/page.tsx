import { fetchAllProjects } from '@/app/lib/data';

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

      <div>
        {selectedProjects.length > 0 ? (
          selectedProjects.map((project) => (
            <div key={project.id}>
              <h2>{project.title}</h2>
              <p>{project.description}</p>

              <div>
                {project.links.map((link, index) => (
                  <a key={index} href={link} target="_blank" rel="noopener noreferrer">
                    {new URL(link).hostname}
                  </a>
                ))}
              </div>

              <div>
                {project.tools.map((tool, index) => (
                  <span key={index}>{tool}</span>
                ))}
              </div>

              <div>
                {project.categories.map((category, index) => (
                  <span key={index}>{category}</span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </main>
  );
}
