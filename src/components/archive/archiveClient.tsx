"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ArchiveList    from "@/components/archive/archiveList";
import PreviewPane    from "@/components/archive/previewPane";
import type { Project } from "@/lib/definitions";
import styles         from "@/styles/archive/archiveClient.module.css";
import clsx           from "clsx";

type Props = { projects: Project[]; searchTerm: string };

export default function ArchiveClient({ projects, searchTerm }: Props) {
  const sp      = useSearchParams();
  const router  = useRouter();
  const [quickView, setQuickView] = useState<Project | null>(null);

  /* ---------------- helper to fetch full record ------------------- */
  async function loadFullProject(id: string) {
    try {
      const res  = await fetch(`/api/project/${id}`);
      if (!res.ok) throw new Error("Project not found");
      const full = (await res.json()) as Project;
      setQuickView(full);
    } catch (err) {
      console.error(err);
      setQuickView(null);
    }
  }

  /* ---------------- open preview if ?project=id is in URL --------- */
  useEffect(() => {
    const id = sp.get("project");
    if (id) loadFullProject(id);
    else    setQuickView(null);
  }, [sp]);

  /* ---------------- row click handler ----------------------------- */
  const handleOpenProject = (id: string) => {
    // keeps URL in sync so Back/Forward works
    router.replace(`?${new URLSearchParams({ ...Object.fromEntries(sp), project:id })}`);

    loadFullProject(id);          // fetch full payload
  };

  return (
    <div className={styles.container}>
      <div className={clsx(styles.archiveListWrapper, quickView ? styles.withPreview : styles.withoutPreview)}>
        <ArchiveList
          projects={projects}          /* light rows */
          searchTerm={searchTerm}
          onOpenProject={handleOpenProject}
        />
      </div>

      {quickView && (
        <PreviewPane project={quickView} onClose={() => router.replace("?")} />
      )}
    </div>
  );
}
