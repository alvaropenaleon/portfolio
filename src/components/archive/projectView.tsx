"use client";

import Image from "next/image";
import React from "react";
import type { Project } from "@/lib/definitions";
import Markdown from "@/components/ui/markdown";
import styles from "@/styles/archive/projectView.module.css";

interface Props {
  project: Project;
  onClose: () => void;                // close only the overlay
  onTogglePane?: () => void;          // condense/expand preview pane
  paneCollapsed?: boolean;
}

export default function ProjectView({
  project,
  onClose,
  onTogglePane,
  paneCollapsed,
}: Props) {
  const { title, heroImage, text, tags, images } = project;

  return (
    <div className={styles.articleRoot}>
      <div className={styles.articleHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={onClose} aria-label="Close full view">
            Close
          </button>
        </div>

        <h1 className={styles.title} title={title}>{title}</h1>

        <div className={styles.headerRight}>
          {onTogglePane ? (
            <button
              className={styles.paneToggle}
              onClick={onTogglePane}
              aria-label={paneCollapsed ? "Expand preview" : "Condense preview"}
              title={paneCollapsed ? "Expand preview" : "Condense preview"}
            >
              {paneCollapsed ? "Expand Preview" : "Condense Preview"}
            </button>
          ) : null}
        </div>
      </div>

      {/* Optional hero at top of article (kept here, not in preview) */}
      {heroImage ? (
        <div className={styles.hero}>
          <Image
            src={heroImage}
            alt={title}
            width={1280}
            height={720}
            className={styles.heroImg}
            priority
          />
        </div>
      ) : null}

      <div className={styles.body}>
        <Markdown content={text ?? ""} />
      </div>

      {Array.isArray(images) && images.length > 0 ? (
        <div className={styles.gallery}>
          {images.map((src, i) => (
            <div className={styles.galleryItem} key={src + i}>
              <Image
                src={src}
                alt={`${title} – image ${i + 1}`}
                width={1600}
                height={1200}
                className={styles.galleryImage}
                quality={90}
              />
            </div>
          ))}
        </div>
      ) : null}

      {tags?.length ? (
        <div className={styles.tags}>
          {tags.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
