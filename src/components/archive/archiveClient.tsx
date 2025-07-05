"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ArchiveList from "@/components/archive/archiveList";
import PreviewPane from "@/components/archive/previewPane";
import type { Project } from "@/lib/definitions";
import styles from "@/styles/archive/archiveClient.module.css";

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

  const handleOpenProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    setQuickViewProject(project);
  };

  const handleClosePreview = () => setQuickViewProject(null);

  return (
    <div className={styles.container}>
      <div className={`${styles.archiveListWrapper} ${quickViewProject ? styles.withPreview : styles.withoutPreview}`}>
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