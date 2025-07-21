// src/components/archive/archiveClient.tsx
"use client";

import {
  useEffect,
  useMemo,
  useState,
  Fragment,
  useRef,
  useCallback,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import PreviewPane from "@/components/archive/previewPane";
import ArchiveItem from "@/components/archive/archiveItem";
import type { Project } from "@/lib/definitions";
import styles from "@/styles/archive/archiveClient.module.css";
import listStyles from "@/styles/archive/archiveList.module.css";
import rowStyles from "@/styles/ui/row.module.css";
import clsx from "clsx";
import { ChevronRight, ChevronDown } from "lucide-react";


const ROW_H = 36;

function prettify(val: string) {
  return val
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

type Props = {
  projects: Project[];
  categories: string[];
  searchTerm: string;
};

export default function ArchiveClient({
  projects,
  categories,
  searchTerm,
}: Props) {
  const sp = useSearchParams();
  const router = useRouter();
  const [quickView, setQuickView] = useState<Project | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [placeCnt, setPlaceCnt] = useState(0);

  /** Fetch full record for preview */
  const loadFullProject = useCallback(async (id: string) => {
    const res = await fetch(`/api/project/${id}`);
    if (res.ok) setQuickView((await res.json()) as Project);
    else setQuickView(null);
  }, []);

  /** Open a project but preserve category/tag filters */
  const handleOpenProject = useCallback((id: string) => {
    const params = new URLSearchParams(Object.fromEntries(sp.entries()));
    params.set("project", id);
    router.replace(`?${params.toString()}`);
    loadFullProject(id);
  }, [sp, router, loadFullProject]);


  /** Select a category as filter (flat list) */
  const handleCategorySelect = useCallback((cat: string) => {
    const params = new URLSearchParams(Object.fromEntries(sp.entries()));
    params.set("category", cat);
    params.delete("tag");
    params.delete("project");
    router.replace(`?${params.toString()}`);
    setQuickView(null);
  }, [sp, router]);

  /** Sync URL → quickView */
  useEffect(() => {
    const id = sp.get("project");
    if (id) loadFullProject(id);
    else setQuickView(null);
  }, [sp]);

  /** Update parent iframe title + path */
  useEffect(() => {
    const raw = window.location.pathname + window.location.search;
    const fixed = raw.startsWith("/embed/")
      ? raw.replace("/embed", "")
      : raw;
    const cat = sp.get("category");
    const tag = sp.get("tag");
    const title = cat
      ? prettify(cat)
      : tag
      ? prettify(tag)
      : "Archive";
    window.parent.postMessage(
      { type: "iframe-path", id: "archive", path: fixed, title },
      window.origin
    );
  }, [sp]);

  /** Group projects by category */
  const byCategory = useMemo(() => {
    const map: Record<string, Project[]> = {};
    categories.forEach((c) => {
      map[c] = projects.filter((p) =>
        p.categories.includes(c)
      );
    });
    return map;
  }, [projects, categories]);

  /** Toggle expand/collapse */
  const toggle = useCallback((cat: string) => {
    setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(cat)) next.delete(cat);
        else next.add(cat);
      return next;
    });
  }, []);

  /** Are we in filtered (flat) mode? */
  const isFiltered = !!sp.get("category") || !!sp.get("tag");

  /** Compute placeholder rows for zebra stripes */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const visibleRows = isFiltered
        ? projects.length
        : categories.reduce((sum, c) => {
            sum++; // folder row
            if (expanded.has(c)) sum += byCategory[c].length;
            return sum;
          }, 0);
      const rowsFit = Math.ceil(el.clientHeight / ROW_H);
      setPlaceCnt(Math.max(rowsFit - visibleRows, 0));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [projects.length, categories, expanded, byCategory, isFiltered]);

  return (
    <div className={styles.container}>
      <div
        className={clsx(
          styles.archiveListWrapper,
          quickView ? styles.withPreview : styles.withoutPreview
        )}
      >
        {/* Sticky header */}
        <div className={listStyles.headerRow}>
          <div className={listStyles.row}>
            <p className={rowStyles.col1}></p>
            <p className={rowStyles.col2}>Name</p>
            <p className={rowStyles.col3}></p>
            <p className={rowStyles.col4}>Comments</p>
            <p className={rowStyles.col5}>Tags</p>
            <p className={rowStyles.col6}>Date Added</p>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          className={listStyles.scroller}
          ref={scrollerRef}
        >
          {isFiltered ? (
            // flat, filtered list
            projects.map((p) => (
              <ArchiveItem
                key={p.id}
                project={p}
                searchTerm={searchTerm}
                onOpenProject={handleOpenProject}
              />
            ))
          ) : (
            // grouped by folder
            categories.map((cat) => (
                <Fragment key={cat}>
                  <div
                    tabIndex={0}
                    className={rowStyles.row4col}
                    onDoubleClick={() => handleCategorySelect(cat)}
                  >
                    {/* Col 1: arrow icon only toggles expand/collapse */}
                    <div className={rowStyles.col1}>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(cat);
                        }}
                        style={{ cursor: "pointer" }}
                        
                      >
                        {expanded.has(cat) ? (
                          <ChevronDown className={styles.catChevron} size={18} strokeWidth={2.6}/>
                        ) : (
                          <ChevronRight className={styles.catChevron} size={18} strokeWidth={2.6} />
                        )}
                      </span>
                    </div>
              
                    {/* Col 2: folder icon, centered */}
                    <div className={rowStyles.col2}>
                      <Image
                        src="/folder.png"
                        alt="Folder"
                        width={34}
                        height={34}
                        className={styles.catFolder}
                      />
                      {/* category name */}
                       <span className={styles.catLabel}>{cat}</span>
                    </div>
              
              
                    {/* Cols 4–6 stay blank on folder rows */}
                  </div>
              
                  {expanded.has(cat) &&
                    byCategory[cat].map((p) => (
                      <ArchiveItem
                        key={p.id}
                        project={p}
                        searchTerm={searchTerm}
                        onOpenProject={handleOpenProject}
                        className={rowStyles.indentedRow}
                      />
                    ))}
                </Fragment>
              ))
              
          )}

          {/* placeholder rows for zebra */}
          {Array.from({ length: placeCnt }).map((_, i) => (
            <div
              key={i}
              className={rowStyles.row4col}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Quick‑view pane */}
      {quickView && (
        <PreviewPane
          project={quickView}
          onClose={() => router.replace("?")}
        />
      )}
    </div>
  );
}
