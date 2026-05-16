"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import AuthGuard from "@/components/AuthGuard";
import VesselListRow from "@/components/VesselListRow";
import EmptyState from "@/components/EmptyState";
import { getMyVessels } from "@/lib/api";

function MyVesselsContent() {
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getMyVessels();
        if (!cancelled) {
          setVessels(data || []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const filtered = vessels.filter((v) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (v.name || "").toLowerCase().includes(q) ||
      (v.mmsi || "").toString().includes(q)
    );
  });

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav showVtsActive={true} />

      <main className="flex-1 px-8 py-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-xs font-semibold tracking-wider text-[var(--color-text-muted)] mb-2">
              DASHBOARD / FLEET MANAGEMENT
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Vessel Fleet Overview
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1 max-w-2xl">
              Real-time telemetry and operational status for all registered assets under your command authority.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2"
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="var(--color-text-muted)" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Vessel or MMSI..."
                className="pl-10 pr-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-md text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-cyan)] focus:outline-none w-72"
              />
            </div>
            <Link
              href="/verify"
              className="px-4 py-2.5 bg-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan-dim)] text-[var(--color-bg-primary)] font-semibold text-sm rounded-md transition-colors flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              ADD VESSEL
            </Link>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)] text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)]">
            <div className="col-span-3">VESSEL IDENTITY</div>
            <div className="col-span-2">CURRENT STATUS</div>
            <div className="col-span-3">POSITION REPORT</div>
            <div className="col-span-2">TELEMETRY</div>
            <div className="col-span-1">SIGNAL</div>
            <div className="col-span-1 text-right">ACTIONS</div>
          </div>

          {loading && (
            <div className="px-4 py-12 text-center text-sm text-[var(--color-text-muted)]">
              Loading fleet...
            </div>
          )}

          {!loading && error && (
            <div className="px-4 py-12 text-center text-sm text-[var(--color-status-danger)]">
              Backend unavailable. Connect the API to see your fleet.
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="px-4 py-12">
              {search ? (
                <div className="text-center text-sm text-[var(--color-text-muted)]">
                  No vessels match your search.
                </div>
              ) : (
                <EmptyState
                  icon={
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                      <path d="M19 7H5l2-4h10l2 4z" />
                      <path d="M12 7v14" />
                    </svg>
                  }
                  title="No vessels registered"
                  description="Add your first vessel to begin real-time tracking and collision monitoring."
                  action={
                    <Link
                      href="/verify"
                      className="px-5 py-2.5 bg-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan-dim)] text-[var(--color-bg-primary)] font-semibold text-sm rounded-md transition-colors"
                    >
                      Register First Vessel
                    </Link>
                  }
                />
              )}
            </div>
          )}

          {!loading && !error && filtered.map((vessel) => (
            <VesselListRow key={vessel.mmsi} vessel={vessel} />
          ))}
        </div>

        {!loading && !error && filtered.length > 0 && (
          <div className="mt-4 text-xs text-[var(--color-text-muted)] tracking-wider">
            SHOWING {filtered.length} OF {vessels.length} ACTIVE VESSELS
          </div>
        )}
      </main>
    </div>
  );
}

export default function MyVesselsPage() {
  return (
    <AuthGuard>
      <MyVesselsContent />
    </AuthGuard>
  );
}