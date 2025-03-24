import { fetchProjectById } from "@/lib/data";
import { notFound } from "next/navigation";
import { Project } from "@/lib/definitions";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const projectData: Project[] = await fetchProjectById([params.id]);

  if (!projectData.length) {
    notFound();
  }

  const project = projectData[0];

  return (
    <main>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      {/* test */}
    </main>
  );
}