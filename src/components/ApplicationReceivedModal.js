"use client";

import Modal from "./Modal";

export default function ApplicationReceivedModal({ open, onClose, onGoToFleet }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center text-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[var(--color-accent-cyan)]/20 border border-[var(--color-accent-cyan)]/40 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-cyan)" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Vessel Verified
        </h2>

        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Your vessel has been successfully verified and added to your fleet. You can now manage it from the{" "}
          <span className="font-semibold text-[var(--color-accent-cyan)]">My Vessels</span> dashboard.
        </p>

        <button
          onClick={onGoToFleet}
          className="w-full bg-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan-dim)] text-[var(--color-bg-primary)] font-semibold text-sm py-3 rounded-md transition-colors"
        >
          Go to My Vessels
        </button>

        <button
          onClick={onClose}
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}