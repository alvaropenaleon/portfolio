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

  const handleOpenProject = async (id: string) => {
    // Instead of sending a window message for a removed "project" window,
    // update internal state to show the project quick look panel.
    try {
      const res = await fetch(`/api/project/${id}`);
      if (!res.ok) return;
      const proj: Project = await res.json();
      setQuickViewProject(proj);
      // if the project has images, handle the carousel display internally.
      // 
      
      // if (proj.images?.length > 0) {
      //   setCarouselProject({ id, images: proj.images, currentIndex: 0 });
      // }
    } catch (err) {
      console.error("Error loading project images:", err);
    }
  };

  return (
    <>
      <ArchiveList
        projects={projects}
        searchTerm={searchTerm}
        onOpenProject={handleOpenProject}
      />
      {/* Render your quick look project panel inside the archive window */}
      {quickViewProject && (
        <div className="quick-look-panel">
          {/* Your quick look UI for project details goes here */}
          <h2>{quickViewProject.title}</h2>
          {/* ... */}
        </div>
      )}
    </>
  );
}