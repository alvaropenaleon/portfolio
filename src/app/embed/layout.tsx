// app/(embed)/layout.tsx
"use client";

import { Suspense } from "react";
import SyncToParent from "@/components/desktop/syncToParent";

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      {children}
      <SyncToParent />
    </Suspense>
  );
}
