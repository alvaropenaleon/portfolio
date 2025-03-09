import color from "@/styles/ui/color.module.css";

export default function BioComponent({ bio }: { bio: { text: string; class: string }[] }) {
  return (
    <h1>
      {bio.map((segment, index) => (
        <span key={index} className={color[segment.class]}>
          {segment.text}
        </span>
      ))}
    </h1>
  );
}
