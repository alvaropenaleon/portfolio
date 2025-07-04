"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ArchiveList from "@/components/archive/archiveList";
import PreviewPane from "@/components/archive/previewPane"; // ensure this exists
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
    // Optional: if you need to sync URL project param to preview pane
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

  // On row click, open the preview pane with the project info
  const handleOpenProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    setQuickViewProject(project);
  };

  const handleClosePreview = () => setQuickViewProject(null);

  return (
    <div style={{ display: "flex", position: "relative", height: "100%" }}>
      <div style={{ flex: quickViewProject ? "0 0 calc(100% - 400px)" : "1 1 100%" }}>
        <ArchiveList
          projects={projects}
          searchTerm={searchTerm}
          onOpenProject={handleOpenProject}
        />
      </div>
      {quickViewProject && (
        <PreviewPane project={quickViewProject} onClose={handleClosePreview} />
      )}
    </div>
  );
}