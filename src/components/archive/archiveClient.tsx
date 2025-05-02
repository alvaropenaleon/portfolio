// src/components/archive/archiveClient.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ArchiveList from "@/components/archive/archiveList";
import type { Project } from "@/lib/definitions";

type ArchiveClientProps = {
  projects: Project[];
  searchTerm: string;
};

export default function ArchiveClient({ projects, searchTerm }: ArchiveClientProps) {
  const searchParams = useSearchParams();

  // On mount (or when ?project=… changes), tell parent to open windows
  useEffect(() => {
    const id = searchParams.get("project");
    if (!id) return;

    // open the project details window
    window.parent.postMessage(
      { type: "open-window", id: "project", params: { project: id } },
      window.origin
    );

    // fetch project via API to see if it has images
    fetch(`/api/project/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Project not found");
        return res.json();
      })
      .then((proj: Project) => {
        if (proj.images?.length > 0) {
          // open the carousel window
          window.parent.postMessage(
            { type: "open-window", id: "carousel", params: { project: id, index: "0" } },
            window.origin
          );
        }
      })
      .catch(console.error);
  }, [searchParams]);

  const handleOpenProject = async (id: string) => {
    // 1) open project info window
    window.parent.postMessage(
      { type: "open-window", id: "project", params: { project: id } },
      window.origin
    );

    // 2) fetch project via API and open carousel if images exist
    try {
      const res = await fetch(`/api/project/${id}`);
      if (!res.ok) return;
      const proj: Project = await res.json();
      if (proj.images?.length > 0) {
        window.parent.postMessage(
          { type: "open-window", id: "carousel", params: { project: id, index: "0" } },
          window.origin
        );
      }
    } catch (err) {
      console.error("Error loading project images:", err);
    }
  };

  return (
    <ArchiveList
      projects={projects}
      searchTerm={searchTerm}
      onOpenProject={handleOpenProject}
    />
  );
}
