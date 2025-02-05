import { fetchSelectedWork } from '@/app/lib/data';

export default async function SelectedWorkPage() {
  const projects = await fetchSelectedWork();
  console.log("Fetched User:", projects);

  return (
    <main>
      <h1>Selected Work</h1>

      <div>
        {projects.map((project) => (
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
              {project.categories.map((categories, index) => (
                <span key={index}>{categories}</span>
              ))}
            </div>

          </div>
        ))}
      </div>
    </main>
  );
}
