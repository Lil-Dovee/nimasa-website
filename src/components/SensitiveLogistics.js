import { getSensitiveLogistics, getVesselProfile } from "@/lib/mockData";

export default function SensitiveLogistics({ mmsi }) {
  const logistics = getSensitiveLogistics(mmsi);
  const profile = getVesselProfile(mmsi);

  return (
    <>
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-cyan)" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <div className="text-xs font-semibold tracking-wider text-[var(--color-text-primary)]">
            SENSITIVE LOGISTICS
          </div>
        </div>

        <div className="bg-[var(--color-bg-tertiary)] border-l-2 border-[var(--color-accent-cyan)] rounded-r-md p-4 font-mono text-xs space-y-1.5">
          <div>
            <span className="text-[var(--color-accent-cyan)]">Cargo_Type:</span>{" "}
            <span className="text-[var(--color-text-primary)]">{logistics.cargo_type},</span>
          </div>
          <div>
            <span className="text-[var(--color-accent-cyan)]">ETA:</span>{" "}
            <span className="text-[var(--color-text-primary)]">{logistics.eta},</span>
          </div>
          <div>
            <span className="text-[var(--color-accent-cyan)]">Destination:</span>{" "}
            <span className="text-[var(--color-text-primary)]">{logistics.destination},</span>
          </div>
          <div>
            <span className="text-[var(--color-accent-cyan)]">Security_Level:</span>{" "}
            <span className="text-[var(--color-text-primary)]">{logistics.security_level},</span>
          </div>
          <div>
            <span className="text-[var(--color-accent-cyan)]">Crew_complement:</span>{" "}
            <span className="text-[var(--color-text-primary)]">{logistics.crew_complement},</span>
          </div>
          <div>
            <span className="text-[var(--color-accent-cyan)]">Verified_owner:</span>{" "}
            <span className="text-[var(--color-text-primary)]">{logistics.verified_owner ? "True" : "False"}</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="text-xs font-semibold tracking-wider text-[var(--color-text-primary)] mb-3">
          VESSEL PROFILE
        </div>
        <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md overflow-hidden">
          <div className="aspect-[16/9] bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-tertiary)] flex items-center justify-center">
            <svg width="120" height="80" viewBox="0 0 200 120" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
              <path d="M20 80 L180 80 L165 95 L35 95 Z" />
              <rect x="55" y="55" width="90" height="25" />
              <rect x="80" y="35" width="40" height="20" />
              <circle cx="100" cy="20" r="6" />
              <line x1="100" y1="14" x2="100" y2="0" />
            </svg>
          </div>
          <div className="px-4 py-3 border-t border-[var(--color-border-default)]">
            <div className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] mb-1">
              VESSEL CLASS
            </div>
            <div className="text-sm text-[var(--color-text-primary)]">
              {profile.vessel_class} · {profile.length_m}m x {profile.beam_m}m
            </div>
          </div>
        </div>
      </div>
    </>
  );
}