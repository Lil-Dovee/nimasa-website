import Link from "next/link";
import TopNav from "@/components/TopNav";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="text-7xl font-bold text-[var(--color-text-muted)] font-mono">404</div>
        <div className="text-lg text-[var(--color-text-secondary)]">
          This page doesn&apos;t exist.
        </div>
        <div className="flex gap-3 mt-4">
          <Link
            href="/map"
            className="px-5 py-2.5 bg-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan-dim)] text-[var(--color-bg-primary)] font-semibold text-sm rounded-md transition-colors"
          >
            Go to Map
          </Link>
          <Link
            href="/my-vessels"
            className="px-5 py-2.5 border border-[var(--color-border-default)] hover:border-[var(--color-accent-cyan)] text-[var(--color-text-primary)] font-semibold text-sm rounded-md transition-colors"
          >
            My Vessels
          </Link>
        </div>
      </div>
    </div>
  );
}