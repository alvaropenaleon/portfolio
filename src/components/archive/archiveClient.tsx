"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ArchiveList from "@/components/archive/archiveList";
import type { Project } from "@/lib/definitions";

type ArchiveClientProps = {
  projects: Project[];
  searchTerm: string;
};

export default function ArchiveClient({ projects, searchTerm }: ArchiveClientProps) {
  const searchParams = useSearchParams();
  const [quickViewProject, setQuickViewProject] = useState<Project | null>(null);

  useEffect(() => {
    const id = searchParams.get("project");
    if (!id) return;
    
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/project/${id}`);
        if (!res.ok) throw new Error("Project not found");
        const proj: Project = await res.json();
        setQuickViewProject(proj);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProject();
  }, [searchParams]);

  // Look up the project by id and open its demo or code link
  const handleOpenProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    // Defaukts to demo link if available
    const preferredLink = project.links.find(
      (link) => link.type === "code" && link.url
    ) || project.links.find((link) => link.type === "demo" && link.url);

    if (preferredLink && preferredLink.url) {
      window.open(preferredLink.url, "_blank");
    }
  };

  return (
    <>
      <ArchiveList
        projects={projects}
        searchTerm={searchTerm}
        onOpenProject={handleOpenProject}
      />
      {quickViewProject && (
        <div className="quick-look-panel">
          {/* <h2>{quickViewProject.title}</h2> */}
        </div>
      )}
    </>
  );
}