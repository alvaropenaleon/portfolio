"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import type { Project } from "@/lib/definitions";
import styles from "@/styles/archive/previewPane.module.css";
import { PreviewTagChip } from "@/components/ui/tag";
// import { PanelRightClose, Maximize2, Minimize2 } from "lucide-react";

interface PreviewPaneProps {
  project: Project;
  onClose: () => void;
  onOpenFullView?: () => void;   // opens content overlay
  onCloseFullView?: () => void;  // closes content overlay only
  condensed?: boolean;
  isFullView?: boolean;          // switches button icon + hides hero/desc
  open?: boolean;                 // drives slide in/out
  onExited?: () => void;          // called after slide-out finishes
}

export default function PreviewPane({
  project,
  // onClose,
  onOpenFullView,
  onCloseFullView,
  condensed = false,
  isFullView = false,
  open = true,
  onExited,
}: PreviewPaneProps) {
  const {
    title,
    heroImage,
    description,
    date,
    categories,
    tags,
    role,
    links,
  } = project;

  const categoriesFiltered = (categories ?? []).filter((c) => c !== "Projects");
  const [ready, setReady] = useState(false);
 const chromeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // when closing, wait for transform transition to end, then notify parent to unmount
  useEffect(() => {
    const el = chromeRef.current;
    if (!el) return;
    const onEnd = (e: TransitionEvent) => {
      if (!open && e.propertyName === "transform") onExited?.();
    };
    el.addEventListener("transitionend", onEnd);
    return () => el.removeEventListener("transitionend", onEnd);
  }, [open, onExited]);

  return (
    // data-lock={isFullView && condensed ? "1" : "0"}
    <aside 
        className={`${styles.sidebar} ${condensed ? styles.condensed : ""}`}
        data-ready={ready ? "1" : "0"}
        data-open={open ? "1" : "0"}
        data-condensed={condensed ? "1" : "0"} 
    >
    <div ref={chromeRef} className={styles.chrome}>
      {/* header 
      <div className={styles.header}>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close preview"
          title="Close preview"
        >
          <PanelRightClose size={19} strokeWidth={1.6} />
        </button>

        {isFullView ? (
          <button
            className={styles.headerIcon}
            onClick={() => onCloseFullView?.()}
            aria-label="Close full view"
            title="Close full view"
          >
            <Minimize2 size={18} strokeWidth={1.8} />
          </button>
        ) : (
          <button
            className={styles.headerIcon}
            onClick={() => onOpenFullView?.()}
            aria-label="Open full view"
            title="Open full view"
          >
            <Maximize2 size={18} strokeWidth={1.8} />
          </button>
        )}

        <h5 className={styles.headerTitle}>Preview Pane</h5>
      </div>
      */}

      {/* scrollable block */}
      <div className={styles.content}>
        {/* thumbnail (hidden when full view is open) */}
        {!isFullView && heroImage ? (
          <div className={styles.thumbnailWrapper}>
            <Image
              src={heroImage}
              alt={title}
              width={420}
              height={260}
              className={styles.thumbnail}
              quality={90}
            />
          </div>
        ) : null}

        {/* title */}
        {/* {!isFullView && title ? (
          <h2 className={styles.title}>{title}</h2>
        ) : null}
        */}
        <h2 className={styles.title}>{title}</h2>

        {/* description (hidden when full view is open) */}
        {!isFullView && description ? (
          <p className={styles.kindLine}>{description}</p>
        ) : null}

        {/* meta table */}
        <h4 className={styles.subheadingLine}>Information</h4>
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <td>Created</td>
              <td>{date}</td>
            </tr>

            {links?.length
              ? links.map((l) => (
                  <tr key={l.url}>
                    <td>{l.type}</td>
                    <td>
                      <a href={l.url} target="_blank" rel="noopener noreferrer">
                        {l.url}
                      </a>
                    </td>
                  </tr>
                ))
              : null}

            {role && (
              <tr>
                <td>Role</td>
                <td>{role}</td>
              </tr>
            )}

            {categoriesFiltered?.length ? (
              <tr>
                <td>Categories</td>
                <td>{categoriesFiltered.join(", ")}</td>
              </tr>
            ) : null}
          </tbody>
        </table>

        {/* tags */}
        {tags?.length ? (
          <>
            <h4 className={styles.subheadingLine}>Tags</h4>
            <div className={styles.tagLine}>
              {tags.map((t) => (
                <PreviewTagChip key={t} tag={t} />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* footer CTA — visible only when NOT in full view */}
      {isFullView
        ? (onCloseFullView ? (
            <div 
                className={styles.footerBar}
                onClick={onCloseFullView}
                aria-label="Exit full view"
                title="Exit full view">
              <p
                className={styles.primaryCta}
              >
                Exit full view
              </p>
            </div>
          ) : null)
        : (onOpenFullView ? (
            <div 
                className={styles.footerBar}
                onClick={onOpenFullView}
                aria-label="Open full view"
                title="Open full view">
              <p
                className={styles.primaryCta}
              >
                Open full view
              </p>
            </div>
          ) : null)}
    </div>
    </aside>
  );
}
