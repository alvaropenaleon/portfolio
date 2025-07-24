"use client";

import Image from "next/image";
import React from "react";
import type { Project } from "@/lib/definitions";
import styles from "@/styles/archive/previewPane.module.css";
import { PreviewTagChip } from "@/components/ui/tag";
import { PanelRightClose } from "lucide-react";


interface PreviewPaneProps {
  project: Project;
  onClose: () => void;
}

export default function PreviewPane({ project, onClose }: PreviewPaneProps) {
  const { title, heroImage, description, date, categories, tags, role, links, text } = project;

  return (
    <aside className={styles.sidebar}>
      {/* header */}
      <div className={styles.header}>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close preview"
          >
            <PanelRightClose size={20} strokeWidth={1.6}/>
          </button>
          <h5 className={styles.headerTitle}>Preview Pane</h5>
        </div>

      {/* scrollable block */}
      <div className={styles.content}>
        {/* thumbnail */}
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

        {/* file title + kind */}
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.kindLine}>
            {/* HTML text – 0 KB */}
            {description}
        </p>

        {/* collapsible “Information” (simple table for now) */}
        <h4 className={styles.subheadingLine}>Information</h4>
        <table className={styles.infoTable}>
          <tbody>
            <tr><td>Created</td><td>{date}</td></tr>

            {links?.length && (
                <>
                    {links.map((l) => (
                    <tr key={l.url}>
                        <td>{l.type}</td>
                        <td>
                        <a href={l.url} target="_blank" rel="noopener noreferrer">
                            {l.url}
                        </a>
                        </td>
                    </tr>
                    ))}
                </>
                )}
            
            <tr><td>Comments</td><td>{text}</td></tr>
            
            {role && <tr><td>Role</td><td>{role}</td></tr>}

            {categories?.length && (
              <tr><td>Categories</td><td>{categories.join(", ")}</td></tr>
            )}

          </tbody>
        </table>

        {/* long description / text */}
        {/* {description && <p style={{marginBottom:'1rem'}}>{description}</p>} */}
        {/* {text && <p style={{whiteSpace:'pre-line',marginBottom:'1rem'}}>{text}</p>} */}

        {/* tags */}
        {tags?.length && (
            <>
                <h4 className={styles.subheadingLine}>Tags</h4>
                <div className={styles.tagLine}>
                {tags.map(t => <PreviewTagChip key={t} tag={t} />)}
                </div>
            </>
            )}
      </div>
    </aside>
  );
}
