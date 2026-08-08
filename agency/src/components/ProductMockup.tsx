// Stylized browser-frame mockups for the three live products.
// Pure CSS skeletons — never stale, always crisp on the black theme.

function Chrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0d0d0d]">
      {/* browser bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] bg-white/[0.03]">
        <span className="flex gap-1.5">
          <i className="w-2 h-2 rounded-full bg-white/15" />
          <i className="w-2 h-2 rounded-full bg-white/15" />
          <i className="w-2 h-2 rounded-full bg-white/15" />
        </span>
        <span
          className="ml-2 text-[9px] text-[#666] truncate"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {url}
        </span>
      </div>
      <div className="p-3 h-[150px]">{children}</div>
    </div>
  );
}

function SiteSkeleton() {
  // Marketing site: hero headline + CTA + card row
  return (
    <Chrome url="techtutor.academy">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="h-1.5 w-10 rounded bg-[#2952b8]" />
          <div className="flex gap-2">
            <div className="h-1.5 w-6 rounded bg-white/10" />
            <div className="h-1.5 w-6 rounded bg-white/10" />
            <div className="h-1.5 w-6 rounded bg-white/10" />
          </div>
        </div>
        <div className="h-2.5 w-3/4 rounded bg-white/25 mb-1.5" />
        <div className="h-2.5 w-1/2 rounded bg-white/25 mb-3" />
        <div className="h-1.5 w-2/3 rounded bg-white/10 mb-4" />
        <div className="h-5 w-20 rounded-full bg-[#2952b8] mb-auto" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-8 rounded-md bg-white/[0.06] border border-white/[0.06]" />
          <div className="h-8 rounded-md bg-white/[0.06] border border-white/[0.06]" />
          <div className="h-8 rounded-md bg-white/[0.06] border border-white/[0.06]" />
        </div>
      </div>
    </Chrome>
  );
}

function PortalSkeleton() {
  // Learning portal: XP bar, mission list with a "current" glowing item
  return (
    <Chrome url="techbash.techtutor.academy">
      <div className="flex flex-col h-full gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#2952b8]" />
          <div className="flex-1">
            <div className="h-1.5 w-16 rounded bg-white/25 mb-1" />
            <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#a78bfa]" />
            </div>
          </div>
          <div
            className="text-[9px] text-[#a78bfa]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            LVL 12
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.04] px-2.5 py-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
          <div className="h-1.5 w-24 rounded bg-white/15" />
        </div>
        <div className="flex items-center gap-2 rounded-md border border-[#7C3AED]/50 bg-[#7C3AED]/10 px-2.5 py-2">
          <div className="w-3 h-3 rounded-full bg-[#a78bfa]" />
          <div className="h-1.5 w-32 rounded bg-white/30" />
          <div className="ml-auto h-3.5 w-10 rounded-full bg-[#7C3AED]" />
        </div>
        <div className="flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-2 opacity-50">
          <div className="w-3 h-3 rounded-full bg-white/15" />
          <div className="h-1.5 w-20 rounded bg-white/10" />
        </div>
      </div>
    </Chrome>
  );
}

function AdminSkeleton() {
  // Ops dashboard: sidebar + stat tiles + bar chart
  return (
    <Chrome url="admin.techtutor.academy">
      <div className="flex h-full gap-2.5">
        <div className="w-10 shrink-0 rounded-md bg-white/[0.04] border border-white/[0.06] p-1.5 flex flex-col gap-1.5">
          <div className="h-1.5 rounded bg-[#2C7A7B]" />
          <div className="h-1.5 rounded bg-white/10" />
          <div className="h-1.5 rounded bg-white/10" />
          <div className="h-1.5 rounded bg-white/10" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            {["w-8", "w-6", "w-9"].map((w, i) => (
              <div key={i} className="rounded-md bg-white/[0.05] border border-white/[0.06] p-1.5">
                <div className={`h-2 ${w} rounded bg-white/30 mb-1`} />
                <div className="h-1 w-6 rounded bg-white/10" />
              </div>
            ))}
          </div>
          <div className="flex-1 rounded-md bg-white/[0.03] border border-white/[0.06] p-2 flex items-end gap-1.5">
            {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-[#2C7A7B] to-[#4fd1c5]/70"
                style={{ height: `${h}%`, opacity: 0.5 + (i / 14) }}
              />
            ))}
          </div>
        </div>
      </div>
    </Chrome>
  );
}

export default function ProductMockup({ kind }: { kind: string }) {
  if (kind === "portal") return <PortalSkeleton />;
  if (kind === "admin") return <AdminSkeleton />;
  return <SiteSkeleton />;
}
