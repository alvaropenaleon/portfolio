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
import ProjectView from "@/components/archive/projectView";
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
    return val.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
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
    const { params, setParam } = useWindowNav("archive");
    const { setTitle, open } = useWindowStore();

    const [quickView, setQuickView] = useState<Project | null>(null);
    const [paneProject, setPaneProject] = useState<Project | null>(null); // keep mounted for exit anim
    const [paneOpen, setPaneOpen] = useState(false);
    const [paneCollapsed, setPaneCollapsed] = useState(false);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [placeCnt, setPlaceCnt] = useState(0);
    const [noWidthTransition, setNoWidthTransition] = useState(false);


    const currentQuery = params.get("query") || "";
    const currentCategory = params.get("category") || "";
    const currentTag = params.get("tag") || "";
    const currentProjectId = params.get("project") || "";
    const isFullView = params.get("view") === "full";

    const openImageWindow = useCallback(
        (p: Project) => {
            open("image", {
                payload: { src: p.heroImage, title: p.title },
                pathOverride: `/image?id=${encodeURIComponent(p.id)}&title=${encodeURIComponent(p.title)}`,
            });
        },
        [open]
    );

    // caching / fetching
    const projectCacheRef = useRef(new Map<string, Project>());
    const inflightRef = useRef(new Map<string, Promise<Project | undefined>>());

    const getProject = useCallback((id: string): Promise<Project | undefined> => {
        const cached = projectCacheRef.current.get(id);
        if (cached) return Promise.resolve(cached);
        const existing = inflightRef.current.get(id);
        if (existing) return existing;

        const p = fetch(`/api/project/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json() as Promise<Project>;
            })
            .then((proj) => {
                projectCacheRef.current.set(id, proj);
                return proj;
            })
            .catch((e) => {
                console.error("Failed to fetch project", e);
                return undefined;
            })
            .finally(() => {
                inflightRef.current.delete(id);
            });

        inflightRef.current.set(id, p);
        return p;
    }, []);

    const prefetchProject = useCallback(
        (p: Project) => {
            if (!projectCacheRef.current.has(p.id)) void getProject(p.id);
            const img = new window.Image();
            img.src = p.heroImage;
        },
        [getProject]
    );

    const handleOpenProject = useCallback(
        (p: Project) => {
            setParam("project", p.id);
            setParam("view", undefined); // ensure not in full mode yet
            setPaneCollapsed(false);
            setQuickView(p); // optimistic
            setPaneProject(p);     // make sure pane is rendered
            setPaneOpen(true);     // slide in
            void getProject(p.id).then((full) => {
                if (full) setQuickView((prev) => (prev?.id === p.id ? { ...prev, ...full } : prev));
            });
        },
        [setParam, getProject]
    );

    // sync quickView with URL
    const lastReqIdRef = useRef(0);
    useEffect(() => {
        if (!currentProjectId) {
            setQuickView(null);
            setPaneOpen(false);
            return;
        }
        if (quickView?.id === currentProjectId) return;

        const reqId = ++lastReqIdRef.current;
        void getProject(currentProjectId).then((full) => {
            if (full && reqId === lastReqIdRef.current) setQuickView(full);
        });
    }, [currentProjectId, quickView?.id, getProject]);

    // when we have fresh data, ensure the mounted pane shows it and stays open
    useEffect(() => {
        if (quickView) {
            setPaneProject(quickView);
            setPaneOpen(true);
        }
    }, [quickView]);

    // Title: filters normally, but in full view show the project title
    useEffect(() => {
        let title = "Archive";

        if (isFullView && quickView?.title) {
            title = quickView.title;
        } else if (currentQuery) {
            title = `Searching "${currentQuery}"`;
        } else if (currentCategory) {
            title = prettify(currentCategory);
        } else if (currentTag) {
            title = prettify(currentTag);
        }

        // update the store 
        setTitle("archive", title);
        // broadcast to the desktop shell
        window.dispatchEvent(
            new CustomEvent("archive-title", { detail: { title } })
        );
    }, [
        isFullView,
        quickView?.title,
        currentQuery,
        currentCategory,
        currentTag,
        setTitle,
    ]);



    // By category
    const byCategory = useMemo(() => {
        const map: Record<string, Project[]> = {};
        categories.forEach((c) => {
            map[c] = projects.filter((p) => p.categories.includes(c));
        });
        return map;
    }, [projects, categories]);

    const toggle = useCallback((cat: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(cat)) next.delete(cat);
            else next.add(cat);
            return next;
        });
    }, []);

    const isFiltered = !!(currentQuery || currentCategory || currentTag);

    // zebra placeholders
    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        const ro = new ResizeObserver(() => {
            const visibleRows = isFiltered
                ? projects.length
                : categories
                    /* .filter((c) => c !== "Projects") */
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

    // actions
    const openFullView = useCallback(() => {
        if (!quickView) return;
        setParam("view", "full");
    }, [quickView, setParam]);

    const closeFullView = useCallback(() => {
        if (paneCollapsed) {
            // Disable the width transition just for this close, to avoid the slide.
            setNoWidthTransition(true);

            // Wait a frame so the class is applied before we change layout.
            requestAnimationFrame(() => {
                // Remove both overlay and preview: rows should snap to full width
                setParam("view", undefined);
                setParam("project", undefined);
                setQuickView(null);
                setPaneCollapsed(false);

                // Re-enable transitions after the snap (another frame is safest)
                requestAnimationFrame(() => setNoWidthTransition(false));
            });
        } else {
            // Pane expanded → no width jump, close overlay normally.
            setParam("view", undefined);
        }
    }, [paneCollapsed, setParam]);


    //  smart close handler for the Preview Pane
    const handlePreviewClose = useCallback(() => {
        if (isFullView) {
            // While reading: toggle condensed <-> expanded (don’t close)
            setPaneCollapsed(prev => !prev);
        } else {
            // Not reading:
            if (paneCollapsed) {
                // If collapsed, clicking close re-opens (expands) the pane
                setPaneCollapsed(false);
            } else {
                // If expanded, actually close the preview
                setPaneOpen(false);
            }
        }
    }, [isFullView, paneCollapsed, setParam]);

    // keep icon in sync (rows & full view)
    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent("archive-preview-state", {
                detail: { collapsed: paneCollapsed, visible: paneOpen },
            })
        );
    }, [paneCollapsed, paneOpen]);

    // Allow title-bar button to trigger the SAME handler (no duplication)
    useEffect(() => {
        const listener: EventListener = () => handlePreviewClose();
        window.addEventListener("archive-preview-close", listener);
        return () => window.removeEventListener("archive-preview-close", listener);
    }, [handlePreviewClose]);

    // If user changes filters while the pane was collapsed (after full view),
    // clear any lingering selection and broadcast not visible so the title-bar
    // toggle disables
    useEffect(() => {
        if (!isFullView && paneCollapsed && (quickView || paneProject)) {
            setQuickView(null);
            setPaneProject(null);
            setPaneOpen(false);
            setParam("project", undefined);
            setParam("view", undefined);
            window.dispatchEvent(
                new CustomEvent("archive-preview-state", {
                    detail: { collapsed: true, visible: false },
                })
            );
        }
    }, [currentQuery, currentCategory, currentTag]); // runs on filter changes


    const handleCategorySelect = useCallback(
        (cat: string) => {
            setParam("category", cat);
            setParam("tag", undefined);
            // also ensure list view is reset
            setParam("project", undefined);
            setParam("view", undefined);
            setQuickView(null);
            setPaneCollapsed(false);
        },
        [setParam]
    );

    return (
        <div
            className={styles.container}
            data-pane={paneCollapsed ? "condensed" : "normal"}  // drives CSS var
            data-notrans={noWidthTransition ? "1" : "0"}
        >
            <div
                className={clsx(
                    styles.archiveListWrapper,
                    paneOpen ? styles.withPreview : styles.withoutPreview
                )}
            >
                {/* header row */}
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

                {/* rows scroller */}
                <div className={listStyles.scroller} ref={scrollerRef}>
                    {isFiltered ? (
                        projects.map((p) => (
                            <ArchiveItem
                                key={p.id}
                                project={p}
                                searchTerm={searchTerm}
                                onOpenProject={handleOpenProject}
                                onOpenInWindow={openImageWindow}
                                onHover={() => prefetchProject(p)}
                                onFocus={() => prefetchProject(p)}
                            />
                        ))
                    ) : (
                        categories
                            /* .filter((c) => c !== "Projects") */
                            .map((cat) => (
                                <Fragment key={cat}>
                                    <div
                                        tabIndex={0}
                                        className={rowStyles.row4col}
                                        onClick={() => handleCategorySelect(cat)}
                                    >
                                        <div className={rowStyles.col1}>
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggle(cat);
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {expanded.has(cat) ? (
                                                    <ChevronDown className={styles.catChevron} size={19} strokeWidth={1.8} />
                                                ) : (
                                                    <ChevronRight className={styles.catChevron} size={19} strokeWidth={1.8} />
                                                )}
                                            </span>
                                        </div>
                                        <div className={rowStyles.col2}>
                                            <Image src={cat === "Projects" ? "/smart-folder.png" : "/folder.png"} alt="Folder" width={34} height={34} className={styles.catFolder} />
                                            <span className={styles.catLabel}>
                                                {cat}
                                            </span>
                                        </div>
                                    </div>
                                    {expanded.has(cat) &&
                                        byCategory[cat].map((p) => (
                                            <ArchiveItem
                                                key={p.id}
                                                project={p}
                                                searchTerm=""
                                                onOpenProject={handleOpenProject}
                                                onOpenInWindow={openImageWindow}
                                                onHover={() => prefetchProject(p)}
                                                onFocus={() => prefetchProject(p)}
                                                className={rowStyles.indentedRow}
                                            />
                                        ))}
                                </Fragment>
                            ))
                    )}

                    {/* placeholders */}
                    {Array.from({ length: placeCnt }).map((_, i) => (
                        <div key={i} className={rowStyles.row4col} aria-hidden="true" />
                    ))}
                </div>
            </div>

            {/* Preview Pane */}
            {paneProject ? (
                <PreviewPane
                    project={paneProject}
                    open={paneOpen}
                    onClose={handlePreviewClose}            // ← use the smart close
                    onOpenFullView={openFullView}
                    onCloseFullView={closeFullView}
                    condensed={paneCollapsed}
                    isFullView={isFullView}
                    onExited={() => {
                        // after slide-out, clear URL + local state
                        setPaneProject(null);
                        setParam("project", undefined);
                        setParam("view", undefined);
                        setQuickView(null);
                    }}
                />
            ) : null}

            {/* Project Full View Overlay (covers only the rows area) */}
            {quickView && isFullView ? (
                <div className={styles.overlay}>
                    <ProjectView
                        project={quickView}
                        onClose={closeFullView} // closing content also closes preview
                        onTogglePane={() => setPaneCollapsed((v) => !v)}
                        paneCollapsed={paneCollapsed}
                    />
                </div>
            ) : null}
        </div>
    );
}
