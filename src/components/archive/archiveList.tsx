// src/components/archive/archiveList.tsx
import { useRef, useState, useEffect } from "react";
import ArchiveItem from "@/components/archive/archiveItem";
import type { Project } from "@/lib/definitions";
import layout from "@/styles/archive/archiveList.module.css";

const ROW_H = 36;

type Props = {
  projects: Project[];
  searchTerm: string;
  onOpenProject?: (id: string) => void;
};

export default function ArchiveList({
  projects,
  searchTerm,
  onOpenProject,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [placeCnt, setPlaceCnt] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rowsFit = Math.ceil(el.clientHeight / ROW_H);
      setPlaceCnt(Math.max(rowsFit - projects.length, 0));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [projects.length]);

  return (
    <div className={layout.archivePane}>
      <div className={layout.scroller} ref={scrollRef}>
        {projects.map((p) => (
          <ArchiveItem
            key={p.id}
            project={p}
            searchTerm={searchTerm}
            onOpenProject={onOpenProject}
          />
        ))}
        {Array.from({ length: placeCnt }).map((_, i) => (
          <div key={i} className={layout.rowPlaceholder} />
        ))}
      </div>
    </div>
  );
}
