import { fetchAllProjects } from '@/app/lib/data';

export default async function WorkPage() {
  const projects = await fetchAllProjects();


  return (
    <main>
      <h1>Selected Work</h1>

      <div>
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id}>
              <h2>{project.title}</h2>
              <p>{project.date}</p>

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
