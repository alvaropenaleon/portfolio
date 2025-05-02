"use client";

import { useSearchParams } from "next/navigation";
import ImageCarousel from "@/components/project/imageCarousel";

export default function CarouselPage() {
  const params = useSearchParams();
  const id    = params.get("project")!;
  const startIndex = Number(params.get("index") || "0");


  return (
    <ImageCarousel projectId={id} startIndex={startIndex}/>
  );
}
