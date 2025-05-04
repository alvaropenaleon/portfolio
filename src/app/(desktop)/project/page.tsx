"use client";

import { useSearchParams } from "next/navigation";
import ProjectOverlay from "@/components/project/projectCard";
import { useState, useEffect } from "react";
import type { Project } from "@/lib/definitions";

export default function ProjectPage() {
  const params = useSearchParams();
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


    return (
      <div style={{ padding: "var(--space-md)" }}>
        <ProjectOverlay project={project} />;
      </div>
    );
   
}
