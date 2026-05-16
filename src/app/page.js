"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/my-vessels");
    } else {
      router.replace("/map");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] text-sm">
      Loading...
    </div>
  );
}