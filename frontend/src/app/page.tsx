import Link from "next/link";
import {
  ArrowRight, Check, ChevronRight, CircleCheck, Clock3, FileCheck2,
  Fingerprint, LayoutDashboard, LockKeyhole, Network, ShieldCheck,
} from "lucide-react";
import { BrandMark } from "@/components/brand";
import { SalesforceLogo } from "@/components/salesforce-logo";
import { SiteFooter } from "@/components/site-footer";

const cases = [
  ["AU-2841", "Knee MRI", "Evidence review", "Today", "amber"],
  ["AU-2837", "Physical therapy", "Payer review", "Jul 31", "blue"],
  ["AU-2829", "Lumbar injection", "Ready to submit", "Aug 02", "green"],
];

export default function Home() {
  return (
    <main className="bg-[#071019] text-white">
      <header className="border-b border-white/[.07] bg-[#071019]/95">
        <nav className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-6">
          <BrandMark />
          <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#product" className="hover:text-white">Product</a>
            <a href="#workflow" className="hover:text-white">Workflow</a>
            <a href="#salesforce" className="hover:text-white">Salesforce</a>
            <a href="#security" className="hover:text-white">Security</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300">Sign in</Link>
            <Link href="/register" className="rounded-lg bg-[#76e4df] px-4 py-2.5 text-sm font-semibold text-[#071019]">Request access</Link>
          </div>
        </nav>
      </header>

      <section className="border-b border-white/[.07]">
        <div className="mx-auto grid max-w-[1240px] gap-14 px-6 pb-20 pt-20 lg:grid-cols-[.86fr_1.14fr] lg:items-center lg:pb-28 lg:pt-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.035] px-3 py-1.5 text-xs font-medium text-slate-300">
              <span className="size-1.5 rounded-full bg-emerald-400" /> Built for specialty-care operations
            </div>
            <h1 className="mt-7 max-w-xl text-5xl font-semibold leading-[1.03] tracking-[-.05em] sm:text-6xl">
              Prior authorization, under control.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Authora gives authorization teams one accountable workspace for clinical evidence, payer requirements, submissions, decisions, and appeals.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#76e4df] px-5 py-3.5 text-sm font-semibold text-[#071019]">
                Create a workspace <ArrowRight className="size-4" />
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3.5 text-sm font-semibold">
                Sign in with Salesforce
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500">
              <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-slate-400" /> Tenant-isolated</span>
              <span className="flex items-center gap-2"><Fingerprint className="size-4 text-slate-400" /> Auditable access</span>
              <span className="flex items-center gap-2"><LockKeyhole className="size-4 text-slate-400" /> Encrypted sessions</span>
            </div>
          </div>

          <ProductWindow />
        </div>
      </section>

      <section id="product" className="border-b border-white/[.07] bg-[#09131d]">
        <div className="mx-auto max-w-[1240px] px-6 py-24">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#76e4df]">One operating layer</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-.04em]">Built around the case, not another inbox.</h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-400 lg:justify-self-end">
              Authora connects the work already happening across Salesforce, clinical teams, documents, and payer channels—then preserves ownership and evidence from intake through resolution.
            </p>
          </div>
          <div className="mt-14 grid border-y border-white/[.08] md:grid-cols-3">
            {[
              [FileCheck2, "Readiness", "See missing clinical and payer evidence before submission."],
              [Clock3, "Operations", "Prioritize work by service date, urgency, and ownership."],
              [Network, "Connectivity", "Keep Salesforce context aligned through secure OAuth."],
            ].map(([Icon, title, text], index) => {
              const ItemIcon = Icon as typeof FileCheck2;
              return <article key={title as string} className={`py-8 md:px-8 ${index > 0 ? "border-t border-white/[.08] md:border-l md:border-t-0" : ""}`}><ItemIcon className="size-5 text-[#76e4df]" /><h3 className="mt-8 text-lg font-semibold">{title as string}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{text as string}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-[1240px] px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#76e4df]">Operational workflow</p>
            <h2 className="mt-4 max-w-lg text-4xl font-semibold tracking-[-.04em]">A clear path from intake to payer decision.</h2>
            <p className="mt-5 max-w-lg leading-7 text-slate-400">Each state has an owner, due date, evidence requirement, and immutable activity history.</p>
          </div>
          <div className="border-l border-white/10 pl-7">
            {[
              ["01", "Intake and normalize", "Create the case and align coverage, service, provider, and clinical context."],
              ["02", "Review evidence", "Apply reviewed payer requirements and resolve documentation gaps."],
              ["03", "Submit and follow up", "Preserve the submission package, references, and every payer interaction."],
              ["04", "Decision and appeal", "Capture outcomes, denial reasons, deadlines, and approved appeal work."],
            ].map(([number, title, text]) => <div key={number} className="relative border-b border-white/[.07] py-6 first:pt-0 last:border-0"><span className="absolute -left-[39px] grid size-6 place-items-center rounded-full border border-white/15 bg-[#071019] text-[10px] text-[#76e4df]">{number}</span><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section id="salesforce" className="border-y border-white/[.07] bg-[#f3f7f8] text-[#10212d]">
        <div className="mx-auto grid max-w-[1240px] gap-14 px-6 py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <SalesforceLogo className="h-16 w-24" />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[.16em] text-[#0879b5]">Salesforce connected</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.04em]">Deploy the workflow into the org your team already uses.</h2>
            <p className="mt-5 leading-7 text-slate-600">An administrator connects through OAuth, reviews the installation plan, and authorizes versioned objects, fields, validation rules, permissions, and Flows.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,35,48,.1)]">
            {["Secure OAuth connection", "Org capability assessment", "Admin-reviewed deployment plan", "Transactional metadata installation", "Connection health and audit history"].map((item, index) => <div key={item} className="flex items-center gap-4 border-b border-slate-100 py-4 last:border-0"><span className="grid size-8 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check className="size-4" /></span><span className="flex-1 text-sm font-medium">{item}</span><span className="text-xs text-slate-400">0{index + 1}</span></div>)}
          </div>
        </div>
      </section>

      <section id="security" className="mx-auto max-w-[1240px] px-6 py-24">
        <div className="rounded-2xl border border-white/10 bg-[#0b1722] p-8 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#76e4df]">Accountable by design</p><h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-.04em]">Human-reviewed automation for sensitive healthcare operations.</h2><p className="mt-5 max-w-2xl leading-7 text-slate-400">AI output remains advisory and source-linked. PHI is minimized, tenant-scoped, and excluded from uncontrolled telemetry.</p></div>
            <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#071019]">Request access <ChevronRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function ProductWindow() {
  return (
    <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0c1721] shadow-[0_35px_90px_rgba(0,0,0,.38)]">
      <div className="flex h-11 items-center border-b border-white/[.08] bg-[#121d28] px-4">
        <div className="flex gap-2"><span className="size-3 rounded-full bg-[#ff5f57]" /><span className="size-3 rounded-full bg-[#febc2e]" /><span className="size-3 rounded-full bg-[#28c840]" /></div>
        <div className="mx-auto rounded-md border border-white/[.07] bg-black/10 px-16 py-1 text-[10px] text-slate-500">app.authora.health</div>
      </div>
      <div className="grid min-h-[510px] grid-cols-[58px_1fr]">
        <aside className="border-r border-white/[.07] bg-[#09131c] py-5">
          <div className="mx-auto grid size-8 place-items-center rounded-lg bg-[#76e4df] font-bold text-[#071019]">A</div>
          <div className="mt-8 space-y-3">{[LayoutDashboard, FileCheck2, Network, ShieldCheck].map((Icon, index) => <div key={index} className={`mx-auto grid size-8 place-items-center rounded-lg ${index === 0 ? "bg-white/10 text-white" : "text-slate-600"}`}><Icon className="size-4" /></div>)}</div>
        </aside>
        <div>
          <div className="flex items-center justify-between border-b border-white/[.07] px-5 py-4"><div><p className="text-[10px] uppercase tracking-wider text-slate-500">Operations</p><p className="mt-1 text-sm font-semibold">Authorization command center</p></div><span className="flex items-center gap-2 rounded-md border border-emerald-400/15 bg-emerald-400/[.06] px-2.5 py-1 text-[10px] text-emerald-300"><CircleCheck className="size-3" /> Workspace ready</span></div>
          <div className="grid grid-cols-3 border-b border-white/[.07]">{[["Open cases", "24"], ["Due today", "6"], ["Ready", "11"]].map(([label, value]) => <div key={label} className="border-r border-white/[.07] p-4 last:border-0"><p className="text-[10px] text-slate-500">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>)}</div>
          <div className="p-5"><div className="mb-3 flex items-center justify-between"><p className="text-xs font-semibold">Priority work queue</p><span className="text-[10px] text-slate-500">Updated just now</span></div>
            <div className="overflow-hidden rounded-lg border border-white/[.07]">
              {cases.map(([id, service, status, date, tone]) => <div key={id} className="grid grid-cols-[.75fr_1.2fr_1.25fr_.65fr] gap-2 border-b border-white/[.06] bg-[#0a141e] px-3 py-3 text-[10px] last:border-0"><span className="font-medium text-[#76e4df]">{id}</span><span>{service}</span><span className={tone === "green" ? "text-emerald-300" : tone === "amber" ? "text-amber-300" : "text-sky-300"}>{status}</span><span className="text-right text-slate-500">{date}</span></div>)}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-lg border border-white/[.07] bg-[#0a141e] p-4"><p className="text-[10px] text-slate-500">Documentation readiness</p><div className="mt-4 h-1.5 rounded-full bg-white/[.07]"><div className="h-full w-[78%] rounded-full bg-[#76e4df]" /></div><div className="mt-3 flex justify-between text-[10px]"><span>18 complete</span><span className="text-slate-500">5 need review</span></div></div><div className="rounded-lg border border-white/[.07] bg-[#0a141e] p-4"><p className="text-[10px] text-slate-500">Salesforce connection</p><div className="mt-3 flex items-center gap-3"><SalesforceLogo className="h-8 w-12" /><div><p className="text-[10px] font-medium">Northstar Health</p><p className="text-[9px] text-emerald-300">Connected</p></div></div></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
