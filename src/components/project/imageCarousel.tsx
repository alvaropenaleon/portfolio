// src/components/project/imageCarousel.tsx
"use client";
import { useState, useEffect } from "react";
import { Project } from "@/lib/definitions";

type Props = {
  projectId: string;
  startIndex: number;
};

export default function ImageCarousel({ projectId, startIndex }: Props) {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex]   = useState(startIndex);

  useEffect(() => {
    fetch(`/api/project/${projectId}`)
      .then(r => r.json())
      .then((proj: Project) => setImages(proj.images));
  }, [projectId]);

  if (images.length === 0) return null;

  return (
    <div className="carousel-container">
      <div className="carousel-main">
        <img src={images[index]} alt={`Image ${index + 1}`} />
      </div>
      <div className="carousel-thumbs">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            className={i === index ? "active-thumb" : ""}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
