"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import { clearAuthToken } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { useEffect, useState } from "react";

const PUBLIC_TABS = [{ label: "Map", href: "/map" }];

const OPERATOR_TABS = [
  { label: "Map", href: "/map" },
  { label: "My Vessels", href: "/my-vessels" },
  { label: "Collision Alert", href: "/collision-alert" },
];

export default function TopNav({ showVtsActive = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAuthed(isLoggedIn());
    setMounted(true);
  }, [pathname]);

  function handleLogout() {
    clearAuthToken();
    router.push("/login");
  }

  const tabs = mounted && authed ? OPERATOR_TABS : PUBLIC_TABS;

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-subtle)]">
      <div className="flex items-center gap-8">
        <Link href={authed ? "/my-vessels" : "/map"}>
          <Logo size={44} />
        </Link>
        <div className="flex items-center gap-6">
          {tabs.map((tab) => {
            const active =
              pathname === tab.href ||
              (tab.href !== "/map" && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`text-sm font-medium tracking-wide transition-colors pb-1 border-b-2 ${
                  active
                    ? "text-[var(--color-accent-cyan)] border-[var(--color-accent-cyan)]"
                    : "text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)]"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {showVtsActive && authed && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-status-success)] animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-[var(--color-text-primary)]">
              VTS ACTIVE
            </span>
          </div>
        )}

        {authed && (
          <button
            aria-label="Notifications"
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        )}

        {mounted && authed ? (
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-status-danger)] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        ) : (
          <Link
            href="/login"
            className="text-xs font-semibold tracking-wider text-[var(--color-accent-cyan)] hover:text-[var(--color-text-primary)] transition-colors px-3 py-1.5 border border-[var(--color-accent-cyan)] rounded-md"
          >
            SIGN IN
          </Link>
        )}

        {authed && (
          <div className="w-9 h-9 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] flex items-center justify-center text-sm font-medium text-[var(--color-text-secondary)]">
            U
          </div>
        )}
      </div>
    </nav>
  );
}