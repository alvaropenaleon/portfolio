"use client";

import Image from "next/image";
import React from "react";
import type { Project } from "@/lib/definitions";
import Markdown from "@/components/ui/markdown";
import styles from "@/styles/archive/projectView.module.css";
// import { ChevronLeft } from "lucide-react";

interface Props {
  project: Project;
  onClose: () => void;                // close only the overlay
  onTogglePane?: () => void;          // condense/expand preview pane
  paneCollapsed?: boolean;
}

export default function ProjectView({
  project,
  // onClose,
  // onTogglePane,
  // paneCollapsed,
}: Props) {
  const { title, text, images } = project; // pass heroImage if used

  return (
    <>
    {/*}
      <div className={styles.articleHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={onClose} aria-label="Close full view">
          <ChevronLeft className={styles.catChevron} size={18} strokeWidth={2.6} />
          Back
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
      */}

    <div className={styles.articleRoot}>
      {/* hero at top of article
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
      */}

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

    </div>
    </>
  );
}
