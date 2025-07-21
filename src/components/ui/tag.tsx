// components/ui/tag.tsx
import styles from "@/styles/ui/tag.module.css";

/* --------------------------------------------------------------------- */
/* 1. TAG → COLOUR PALETTE                                               */
/* --------------------------------------------------------------------- */
export const TAG_FAMILY: Record<string, string> = {
  /* Languages */
  C: "var(--tag-blue)", 
  "C++": "var(--tag-blue)", 
  "C#": "var(--tag-blue)",
  Python: "var(--tag-blue)", 
  TypeScript: "var(--tag-blue)",

  /* Frameworks / Libs */
  React: "var(--tag-purple)", 
  "Next.js": "var(--tag-purple)",
  TensorFlow: "var(--tag-purple)", 
  SpringBoot: "var(--tag-purple)",
  TailwindCSS: "var(--tag-purple)",

  /* Platforms / DevOps */
  Docker: "var(--tag-green)", 
  AWS: "var(--tag-green)",
  "AWS Lambda": "var(--tag-green)", 
  Firebase: "var(--tag-green)",
  Grafana: "var(--tag-green)", 
  "Node-RED": "var(--tag-green)",
  MQTT: "var(--tag-green)", 
  PostgreSQL: "var(--tag-teal)",

  /* Design */
  Figma: "var(--tag-orange)", 
  Illustrator: "var(--tag-orange)",
  InDesign: "var(--tag-orange)", 
  "UI/UX": "var(--tag-orange)",

  /* Creative / Media */
  Processing: "var(--tag-yellow)", 
  p5js: "var(--tag-yellow)",
  Photography: "var(--tag-yellow)", 
  Photoshop: "var(--tag-yellow)",

  "Timescale DB": "var(--tag-orange)",
  BERT: "var(--tag-red)",

};

/* --------------------------------------------------------------------- */
/* 2. TEXT CHIP (unchanged)                                              */
/* --------------------------------------------------------------------- */
type TagProps = { label: string; withComma?: boolean };

export default function Tag({
    label,
    withComma = false,
    className = '',          // new
  }: TagProps & { className?: string }) {
    return (
      <>
        <span className={`${styles.tag} ${className}`}>{label}</span>
        {withComma && <span>,&nbsp;</span>}
      </>
    );
  }

/* --------------------------------------------------------------------- */
/* 3. ONE COLOURED DOT                                                   */
/* --------------------------------------------------------------------- */
export function TagDot({ tag }: { tag: string }) {
  const color = TAG_FAMILY[tag] ?? "var(--brand-grey)";
  return (
    <span
      className={styles.dot}
      style={{ backgroundColor: color }}
      title={tag}
    />
  );
}

/* --------------------------------------------------------------------- */
/* 4. STACK OF ≤3 DOTS  + “+n”                                           */
/* --------------------------------------------------------------------- */
export function TagStack({ tags }: { tags?: string[] }) {   // ← optional
    const safe = tags ?? [];          // fallback to empty array
    const vis   = safe.slice(0, 3);
    // const extra = safe.length - vis.length;
  
    return (
      <span className={styles.tagStack}>
        {vis.map((t) => (
          <TagDot key={t} tag={t} />
        ))}
       {/*  {extra > 0 && <span className={styles.extraCount}>+{extra}</span>} */}
      </span>
    );
  }


/* --------------------------------------------------------------------- */
/* 5. COLOUR ORDER + SORT HELPER                                         */
/* --------------------------------------------------------------------- */
export const COLOR_ORDER = [
    'green', 'blue', 'purple', 'red', 'orange', 'yellow', 'grey',
  ];
  
  export function sortTagsByColor(tags: string[]) {
    return [...tags].sort((a, b) => {
      const ia = COLOR_ORDER.findIndex(c => TAG_FAMILY[a]?.includes(c));
      const ib = COLOR_ORDER.findIndex(c => TAG_FAMILY[b]?.includes(c));
      return ia !== ib ? ia - ib : a.localeCompare(b);
    });
  }

  /* --------------------------------------------------------------------- */
/* 6. PREVIEW-PANE RECTANGLE TAG                                         */
/* --------------------------------------------------------------------- */
export function PreviewTagChip({ tag }: { tag: string }) {
    const bg = TAG_FAMILY[tag] ?? "var(--brand-grey)"; 
  
    return (
      <span
        className={`${styles.chip}`} 
        style={{ backgroundColor: bg }}
        title={tag}
      >
        {tag}
      </span>
    );
  }
  