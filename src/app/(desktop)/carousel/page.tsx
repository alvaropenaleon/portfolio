"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ImageCarousel from "@/components/project/imageCarousel";

export default function CarouselPage() {
  const params = useSearchParams();
  const router = useRouter();
  const id    = params.get("project")!;
  const startIndex = Number(params.get("index") || "0");

  const handleClose = () => {
    const ps = new URLSearchParams(window.location.search);
    ps.delete("index");
    router.replace(`?${ps.toString()}`, { scroll: false });

    window.parent.postMessage({ type: "close-window", id: "carousel" }, window.origin);
  };

  return (
    <ImageCarousel projectId={id} startIndex={startIndex} onClose={handleClose}/>
  );
}
