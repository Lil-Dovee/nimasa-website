"use client";

import dynamic from "next/dynamic";

const VesselMap = dynamic(() => import("./VesselMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] text-sm">
      Loading map...
    </div>
  ),
});

export default VesselMap;