"use client";
import {
  useEffect,
  useMemo,
  useState,
  Fragment,
  useRef,
  useCallback,
} from "react";
import Image from "next/image";
import PreviewPane from "@/components/archive/previewPane";
import ArchiveItem from "@/components/archive/archiveItem";
import type { Project } from "@/lib/definitions";
import styles from "@/styles/archive/archiveClient.module.css";
import listStyles from "@/styles/archive/archiveList.module.css";
import rowStyles from "@/styles/ui/row.module.css";
import clsx from "clsx";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import { useWindowNav } from "@/hooks/useWindowNav";

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
  const { params, setParam } = useWindowNav('archive');
  const { setTitle } = useWindowStore();
  const [quickView, setQuickView] = useState<Project | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [placeCnt, setPlaceCnt] = useState(0);

  // Reset expansion state when filters change
  const currentQuery = params.get('query') || '';
  const currentCategory = params.get('category') || '';
  const currentTag = params.get('tag') || '';

  // Load initial folder state from sessionStorage on first render
    useEffect(() => {
        const savedExpanded = sessionStorage.getItem('archive-expanded-folders');
        if (savedExpanded) {
        try {
            const expandedArray = JSON.parse(savedExpanded);
            setExpanded(new Set(expandedArray));
        } catch (error) {
            console.error('Failed to parse saved folder state:', error);
            setExpanded(new Set()); // Fallback to collapsed
        }
        } else {
        setExpanded(new Set()); // Start collapsed on first visit
        }
    }, []); // Empty dependency array,  only run once on mount
    
    // Save folder state to sessionStorage whenever it changes
    useEffect(() => {
        const expandedArray = Array.from(expanded);
        sessionStorage.setItem('archive-expanded-folders', JSON.stringify(expandedArray));
    }, [expanded]);

    // cache
    const projectCacheRef = useRef(new Map<string, Project>());
    const inflightRef = useRef(new Map<string, Promise<Project | undefined>>());

    const getProject = useCallback((id: string): Promise<Project | undefined> => {
    const cached = projectCacheRef.current.get(id);
    if (cached) return Promise.resolve(cached);

    const existing = inflightRef.current.get(id);
    if (existing) return existing;

    const p = fetch(`/api/project/${id}`)
        .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Project>;
        })
        .then(proj => {
        projectCacheRef.current.set(id, proj);
        return proj;
        })
        .catch(e => {
        console.error('Failed to fetch project', e);
        return undefined;
        })
        .finally(() => {
        inflightRef.current.delete(id);
        });

    inflightRef.current.set(id, p);
    return p;
    }, []);

    // hover prefetch = warm cache + image, but DO NOT setQuickView
    const prefetchProject = useCallback((p: Project) => {
    if (!projectCacheRef.current.has(p.id)) void getProject(p.id);
    const img = new window.Image();
    img.src = p.heroImage;
    }, [getProject]);

    // click = show immediately, then enrich
    const handleOpenProject = useCallback((p: Project) => {
    setParam('project', p.id);
    setQuickView(p);                    // optimistic
    void getProject(p.id).then(full => {
        if (full) {
        setQuickView(prev => prev?.id === p.id ? { ...prev, ...full } : prev);
        }
    });
    }, [setParam, getProject]);

    // URL sync (avoid double fetch + stale overwrites)
    const lastReqIdRef = useRef(0);
    useEffect(() => {
    const id = params.get('project');
    if (!id) { setQuickView(null); return; }
    if (quickView?.id === id) return;

    const reqId = ++lastReqIdRef.current;
    void getProject(id).then(full => {
        if (full && reqId === lastReqIdRef.current) {
        setQuickView(full);
        }
    });
    }, [params, quickView?.id, getProject]);

  

  /** Select a category as filter (flat list) */
  const handleCategorySelect = useCallback((cat: string) => {
    setParam("category", cat);
    setParam("tag", undefined);
    setParam("project", undefined);
    setQuickView(null);
  }, [setParam]);


  /** Dynamic title into store */
  useEffect(() => {
    const query = params.get("query");
    const category = params.get("category");
    const tag = params.get("tag");
    let title = "Archive";
    if (query) title = `Searching "${query}"`;
    else if (category) title = prettify(category);
    else if (tag) title = prettify(tag);
    setTitle("archive", title);
  }, [params, setTitle]);

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
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  const isFiltered = !!(currentQuery || currentCategory || currentTag);

  // Calculate placeholder rows for zebra striping
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const visibleRows = isFiltered
        ? projects.length
        : categories
            .filter(c => c !== "Work") // don't count Work category
            .reduce((sum, c) => {
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
        <div
          className={listStyles.scroller}
          ref={scrollerRef}
        >
          {isFiltered ? (
            // Show flat filtered list
            projects.map((p) => (
              <ArchiveItem
                key={p.id}
                project={p}
                searchTerm={searchTerm}
                onOpenProject={handleOpenProject}
                onHover={() => prefetchProject(p)} 
                onFocus={() => prefetchProject(p)}
              />
            ))
          ) : (
            // Show categorized view
            categories
              .filter(c => c !== "Work") // do not render work category
              .map((cat) => (
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
                  </div>
                  {expanded.has(cat) &&
                    byCategory[cat].map((p) => (
                      <ArchiveItem
                        key={p.id}
                        project={p}
                        searchTerm=""
                        onOpenProject={handleOpenProject}
                        onHover={() => prefetchProject(p)} 
                        onFocus={() => prefetchProject(p)}
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
      {quickView && (
        <PreviewPane
          project={quickView}
          onClose={() => setParam("project", undefined)}
        />
      )}
    </div>
  );
}