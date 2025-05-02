"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ProjectOverlay from "@/components/project/projectCard";
import { useState, useEffect } from "react";
import type { Project } from "@/lib/definitions";

export default function ProjectPage() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("project")!;

  const [project, setProject] = useState<Project | null>(null);
  useEffect(() => {
    fetch(`/api/project/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((proj) => setProject(proj))
      .catch((err) => console.error(err));
  }, [id]);
  if (!project) return null;

  const handleClose = () => {
    // 1) remove the project param from the iframe URL
    const ps = new URLSearchParams(window.location.search);
    ps.delete("project");
    router.replace(`?${ps.toString()}`, { scroll: false });

    // 2) inform parent to close the "project" window
    window.parent.postMessage({ type: "close-window", id: "project" }, window.origin);
  };

  return <ProjectOverlay project={project} onClose={handleClose} />;
}
