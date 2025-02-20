"use client";

import dynamic from "next/dynamic";

const Clock = dynamic(() => import("./clock"), { ssr: false });

export default function ClockClient() {
  return <Clock />;
}
