import styles from "@/styles/ui/colour.module.css";
import typo from "@/styles/ui/typography.module.css";

export default function BioComponent({ bio }: { bio: { text: string; class: string }[] }) {
  return (
    <h1 className={typo.xxl}>
      {bio.map((segment, index) => (
        <span key={index} className={styles[segment.class]}>
          {segment.text}
        </span>
      ))}
    </h1>
  );
}
