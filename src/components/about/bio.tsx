import color from "@/styles/ui/color.module.css";
import typo from "@/styles/ui/typography.module.css";

export default function BioComponent({ bio }: { bio: { text: string; class: string }[] }) {
  return (
    <h1 className={typo.xl}>
      {bio.map((segment, index) => (
        <span key={index} className={color[segment.class]}>
          {segment.text}
        </span>
      ))}
    </h1>
  );
}
