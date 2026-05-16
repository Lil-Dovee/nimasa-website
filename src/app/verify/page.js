"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import AuthGuard from "@/components/AuthGuard";
import VerificationStepper from "@/components/VerificationStepper";
import FileUploadCard from "@/components/FileUploadCard";
import ApplicationReceivedModal from "@/components/ApplicationReceivedModal";
import { submitVerification } from "@/lib/api";

function VerifyContent() {
  const router = useRouter();
  const [vesselName, setVesselName] = useState("");
  const [mmsi, setMmsi] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [radioFile, setRadioFile] = useState(null);
  const [gmdssFile, setGmdssFile] = useState(null);
  const [registryFile, setRegistryFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  function validateMmsi(value) {
    return /^\d{9}$/.test(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!validateMmsi(mmsi)) {
      setError("MMSI must be exactly 9 digits");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("mmsi", mmsi);
      formData.append("vessel_name", vesselName);
      if (radioFile) formData.append("ship_radio_license", radioFile);
      if (gmdssFile) formData.append("gmdss_certificate", gmdssFile);
      if (registryFile) formData.append("ship_registry_certificate", registryFile);

      await submitVerification(formData);
      setShowSuccess(true);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <TopNav />

        <main className="flex-1 px-8 py-8">
          <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
            <aside className="col-span-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg p-8 flex flex-col">
              <div className="text-xs font-semibold tracking-wider text-[var(--color-accent-cyan)] mb-2">
                SECURITY PROTOCOL
              </div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">
                Vessel Verification
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-8">
                To maintain maritime security, all vessel operators must verify their credentials against the NIMASA central registry.
              </p>

              <div className="flex-1">
                <VerificationStepper currentStep={1} />
              </div>

              <div className="flex items-center gap-2 text-[10px] tracking-wider text-[var(--color-text-muted)] pt-6 border-t border-[var(--color-border-subtle)] mt-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-cyan)] animate-pulse" />
                ENCRYPTED CHANNEL SECURED
              </div>
            </aside>

            <form
              onSubmit={handleSubmit}
              className="col-span-8 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-lg p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-cyan)" strokeWidth="2">
                  <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                  <path d="M19 7H5l2-4h10l2 4z" />
                  <path d="M12 7v14" />
                </svg>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Registry Details
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)]">
                    VESSEL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={vesselName}
                    onChange={(e) => setVesselName(e.target.value)}
                    placeholder="e.g. MV Atlantic Sentinel"
                    className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-cyan)] focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)]">
                    MMSI NUMBER
                  </label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    pattern="\d{9}"
                    maxLength={9}
                    value={mmsi}
                    onChange={(e) => setMmsi(e.target.value.replace(/\D/g, ""))}
                    placeholder="9-digit identification"
                    className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-4 py-3 text-sm font-mono text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-cyan)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-cyan)" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="17 11 19 13 23 9" />
                </svg>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Operator Credentials
                </h2>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <label className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)]">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter legal name"
                  className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-cyan)] focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)]">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="official@domain.com"
                    className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-cyan)] focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)]">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-cyan)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-cyan)" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                    Statutory Documents
                  </h2>
                </div>
                <div className="px-3 py-1.5 rounded-md bg-[var(--color-accent-cyan)]/15 border border-[var(--color-accent-cyan)]/30 text-[10px] font-bold tracking-wider text-[var(--color-accent-cyan)]">
                  MAX 5MB | PDF, JPG, PNG
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-8">
                <FileUploadCard
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2">
                      <path d="M4.93 19.07A10 10 0 0 1 4.93 4.93M19.07 4.93a10 10 0 0 1 0 14.14" />
                      <path d="M7.76 16.24a6 6 0 0 1 0-8.48M16.24 7.76a6 6 0 0 1 0 8.48" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  }
                  title="Ship Radio License"
                  subtitle="Required for communication compliance"
                  onChange={setRadioFile}
                />
                <FileUploadCard
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  }
                  title="GMDSS Radio Certificate"
                  subtitle="Global Maritime Distress Safety System"
                  onChange={setGmdssFile}
                />
                <FileUploadCard
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="9" y1="14" x2="15" y2="14" />
                      <line x1="9" y1="17" x2="15" y2="17" />
                    </svg>
                  }
                  title="Ship Registry Certificate"
                  subtitle="Official flag state documentation"
                  onChange={setRegistryFile}
                />
              </div>

              {error && (
                <div className="text-xs text-[var(--color-status-danger)] bg-[var(--color-status-danger)]/10 border border-[var(--color-status-danger)]/40 rounded-md px-3 py-2 mb-4">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan-dim)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-bg-primary)] font-semibold text-sm px-8 py-3 rounded-md transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit for Verification"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/map")}
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                  Cancel Request
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <ApplicationReceivedModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        onGoToFleet={() => router.push("/my-vessels")}
      />
    </>
  );
}

export default function VerifyPage() {
  return (
    <AuthGuard>
      <VerifyContent />
    </AuthGuard>
  );
}