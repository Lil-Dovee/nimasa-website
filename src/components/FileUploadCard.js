"use client";

import { useRef, useState } from "react";

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";

export default function FileUploadCard({ icon, title, subtitle, onChange }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  function validateAndSet(selected) {
    setError(null);

    if (!selected) {
      setFile(null);
      onChange?.(null);
      return;
    }

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Only PDF, JPG, or PNG allowed");
      return;
    }

    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File exceeds ${MAX_SIZE_MB}MB limit`);
      return;
    }

    setFile(selected);
    onChange?.(selected);
  }

  function handleClick() {
    inputRef.current?.click();
  }

  function handleRemove(e) {
    e.stopPropagation();
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onChange?.(null);
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-[var(--color-bg-tertiary)] border rounded-md p-4 cursor-pointer transition-colors ${
        file
          ? "border-[var(--color-status-success)]/60 hover:border-[var(--color-status-success)]"
          : error
          ? "border-[var(--color-status-danger)]/60"
          : "border-[var(--color-border-default)] hover:border-[var(--color-accent-cyan)]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        className="hidden"
        onChange={(e) => validateAndSet(e.target.files?.[0])}
      />
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-md bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
            {file ? file.name : title}
          </div>
          <div className="text-[10px] tracking-wider text-[var(--color-text-muted)] mt-0.5 uppercase">
            {file
              ? `${(file.size / 1024 / 1024).toFixed(2)} MB · uploaded`
              : subtitle}
          </div>
          {error && (
            <div className="text-[10px] text-[var(--color-status-danger)] mt-1">{error}</div>
          )}
        </div>
        <button
          type="button"
          onClick={file ? handleRemove : undefined}
          className="w-8 h-8 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex-shrink-0"
          aria-label={file ? "Remove file" : "Add file"}
        >
          {file ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}