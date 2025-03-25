import { fetchProjectById } from "@/lib/data";
import { notFound } from "next/navigation";
import { Project } from "@/lib/definitions";

interface ProjectPageProps {
    params: Promise<{
      id: string;
    }>;
  }
  
export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;
    const projectData: Project[] = await fetchProjectById([id]);

    if (!projectData.length) {
        notFound();
    }

    const project = projectData[0];

    return (
        <main>
            <h1>{project.title}</h1>
            <h2>{project.description}</h2>
            <p>{project.text}</p>
            {/* test */}
        </main>
    );
}