const STEPS = [
  { num: 1, label: "Vessel Identity", sub: "COMPLETE INFORMATION" },
  { num: 2, label: "Digital Certification", sub: "DOCUMENT UPLOADS" },
  { num: 3, label: "Approval", sub: "INSTANT VERIFICATION" },
];

export default function VerificationStepper({ currentStep = 1 }) {
  return (
    <div className="flex flex-col gap-6">
      {STEPS.map((step) => {
        const active = step.num === currentStep;
        const complete = step.num < currentStep;
        return (
          <div key={step.num} className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                active
                  ? "bg-[var(--color-accent-cyan)] text-[var(--color-bg-primary)]"
                  : complete
                  ? "bg-[var(--color-status-success)] text-[var(--color-bg-primary)]"
                  : "bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-[var(--color-text-muted)]"
              }`}
            >
              {complete ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="m5 12 5 5L20 7" />
                </svg>
              ) : (
                step.num
              )}
            </div>
            <div className="pt-0.5">
              <div
                className={`text-sm font-semibold ${
                  active || complete
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {step.label}
              </div>
              <div className="text-[10px] tracking-wider text-[var(--color-text-muted)]">
                {step.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
