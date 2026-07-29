import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  FileCheck2,
  Fingerprint,
  LayoutDashboard,
  Network,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { BrandMark } from "@/components/brand";
import { SalesforceLogo } from "@/components/salesforce-logo";
import { SiteFooter } from "@/components/site-footer";

const cases = [
  ["AU-2841", "Knee MRI", "Evidence review", "Due today", "amber"],
  ["AU-2837", "Physical therapy", "Payer review", "Jul 31", "blue"],
  ["AU-2829", "Lumbar injection", "Ready to submit", "Aug 02", "green"],
];

const workflow = [
  ["01", "Intake", "Normalize service, coverage, provider, and priority data."],
  ["02", "Evidence", "Surface missing documentation before submission."],
  ["03", "Submit", "Preserve the payer-ready package and reference trail."],
  ["04", "Resolve", "Track decisions, denials, deadlines, and appeals."],
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#f7f8f6] text-[#10232c]">
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav className="mx-auto flex h-16 max-w-[1240px] items-center justify-between rounded-2xl border border-black/[.06] bg-white/88 px-5 shadow-[0_18px_60px_rgba(22,40,48,.09)] backdrop-blur-2xl">
          <BrandMark dark={false} />
          <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a href="#platform" className="transition hover:text-[#10232c]">Platform</a>
            <a href="#workflow" className="transition hover:text-[#10232c]">Workflow</a>
            <a href="#salesforce" className="transition hover:text-[#10232c]">Salesforce</a>
            <a href="#security" className="transition hover:text-[#10232c]">Security</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden px-4 py-2 text-sm font-semibold text-slate-600 sm:block">Sign in</Link>
            <Link href="/register" className="group inline-flex items-center gap-2 rounded-xl bg-[#112b35] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(17,43,53,.2)]">
              Request access <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative px-6 pb-24 pt-36 sm:pt-44">
        <div className="welcome-aurora pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_50%_15%,rgba(104,220,208,.23),transparent_31%),radial-gradient(circle_at_18%_34%,rgba(69,157,255,.10),transparent_24%),radial-gradient(circle_at_85%_40%,rgba(101,79,247,.10),transparent_24%)]" />
        <DotField />
        <div className="relative mx-auto max-w-[1180px] text-center">
          <h1 className="mx-auto mt-4 max-w-5xl text-[clamp(3.4rem,7.8vw,7rem)] font-semibold leading-[.9] tracking-[-.072em] text-[#10232c]">
            From intake to payer decision, in one flow.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600">
            Authora coordinates authorization cases, evidence, payer requirements, Salesforce ownership, and human-reviewed AI without losing the operational trail.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#112b35] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(17,43,53,.22)] transition hover:-translate-y-0.5">
              Create your workspace <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
            <a href="#platform" className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-6 py-4 text-sm font-semibold shadow-[0_12px_35px_rgba(22,40,48,.07)]">
              Explore the platform <ChevronRight className="size-4" />
            </a>
          </div>

          <div className="welcome-product relative mx-auto mt-16 max-w-[1120px]">
            <div className="absolute -inset-12 -z-10 rounded-[80px] bg-[radial-gradient(circle,rgba(84,210,198,.23),transparent_65%)] blur-2xl" />
            <ProductWindow />
          </div>
        </div>
      </section>

      <section className="border-y border-black/[.06] bg-white">
        <div className="mx-auto max-w-[1180px] px-6 py-12">
          <div className="overflow-hidden rounded-[26px] border border-[#17343d]/10 bg-[#f5f9f8] shadow-[0_22px_65px_rgba(22,52,61,.07)] lg:grid lg:grid-cols-[1.05fr_1.95fr]">
            <div className="relative overflow-hidden bg-[#12313a] px-7 py-7 text-white">
              <div className="absolute -right-12 -top-14 size-40 rounded-full border border-[#76e4df]/20 bg-[#76e4df]/10 blur-sm" />
              <p className="relative text-[10px] font-semibold uppercase tracking-[.2em] text-[#76e4df]">Purpose-built</p>
              <p className="relative mt-3 max-w-sm text-lg font-semibold leading-6 tracking-[-.025em]">Accountable healthcare operations across the authorization lifecycle.</p>
            </div>
            <div className="grid grid-cols-2 bg-white sm:grid-cols-4">
              {[
                ["01", "Authorization teams"],
                ["02", "Clinical reviewers"],
                ["03", "Revenue cycle"],
                ["04", "Salesforce admins"],
              ].map(([number, role], index) => (
                <div key={role} className={`group relative px-5 py-7 ${index % 2 ? "border-l border-black/[.06]" : ""} ${index > 1 ? "border-t border-black/[.06] sm:border-t-0" : ""} sm:border-l sm:first:border-l-0`}>
                  <span className="text-[9px] font-semibold tracking-[.18em] text-teal-600">{number}</span>
                  <p className="mt-4 text-sm font-semibold leading-5 text-[#17343d] transition group-hover:text-teal-700">{role}</p>
                  <span className="absolute inset-x-5 bottom-0 h-0.5 origin-left scale-x-0 bg-[#76e4df] transition duration-300 group-hover:scale-x-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0d222b] px-6 py-28 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(118,228,223,.17),transparent_30%),radial-gradient(circle_at_15%_75%,rgba(34,116,132,.12),transparent_25%)]" />
        <div className="authora-orbit pointer-events-none absolute left-1/2 top-24 size-[520px] -translate-x-1/2 rounded-full border border-[#76e4df]/10" />
        <div className="relative mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#76e4df]/20 bg-[#76e4df]/[.07] px-4 py-2 text-[10px] font-semibold uppercase tracking-[.2em] text-[#8ce9df]"><span className="size-1.5 animate-pulse rounded-full bg-[#76e4df] shadow-[0_0_14px_4px_rgba(118,228,223,.28)]" />How Authora works</p>
            <h2 className="mt-7 text-5xl font-semibold leading-[.92] tracking-[-.06em] sm:text-7xl">From connection<br /><span className="bg-gradient-to-r from-white via-[#b9faf3] to-[#58d2ca] bg-clip-text text-transparent">to decision.</span></h2>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-400">A guided operating sequence that turns scattered authorization work into one visible, accountable flow.</p>
          </div>
          <div className="relative mt-16 grid gap-4 lg:grid-cols-4">
            <div className="intro-line absolute left-[12%] right-[12%] top-8 hidden h-px bg-white/10 lg:block"><span /></div>
            {[
              [SalesforceLogo, "Connect", "Authorize the Salesforce org securely with OAuth."],
              [Workflow, "Install", "Validate and queue objects, Flow, rules, and app pages."],
              [FileCheck2, "Operate", "Coordinate cases, evidence, owners, and deadlines."],
              [BrainCircuit, "Improve", "Use non-PHI AI guidance with human review."],
            ].map(([Icon, title, text], index) => {
              const StepIcon = Icon as typeof Workflow;
              return <article key={title as string} className="intro-card relative rounded-[22px] border border-white/10 bg-white/[.045] p-6 backdrop-blur" style={{ animationDelay: `${index * .35}s` }}><div className="relative z-10 grid size-16 place-items-center rounded-2xl border border-white/10 bg-[#102c35] shadow-[0_16px_40px_rgba(0,0,0,.25)]">{title === "Connect" ? <SalesforceLogo className="h-9 w-12" /> : <StepIcon className="size-6 text-[#76e4df]" />}</div><p className="mt-8 text-[10px] font-semibold uppercase tracking-[.18em] text-[#76e4df]">0{index + 1}</p><h3 className="mt-2 text-xl font-semibold">{title as string}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{text as string}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section id="platform" className="px-6 py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="eyebrow !text-[#14817a]">Product</p>
              <h2 className="mt-5 text-5xl font-semibold leading-[.98] tracking-[-.055em] sm:text-6xl">From case intake to a defensible next action.</h2>
            </div>
            <div className="self-end lg:pb-2">
              <p className="max-w-2xl text-lg leading-8 text-slate-600">A single operating layer for the information, evidence, tasks, and decisions that normally fragment across inboxes, portals, documents, and CRM records.</p>
              <Link href="/register" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#126f6a]">Start a workspace <ArrowRight className="size-4" /></Link>
            </div>
          </div>

          <div className="mt-16 flex gap-2 overflow-x-auto pb-2">
            {["Case intake", "Evidence readiness", "Payer workflow", "Salesforce CRM", "Decision tracking"].map((item, index) => (
              <span key={item} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-semibold ${index === 0 ? "bg-[#12313a] text-white" : "border border-black/[.08] bg-white text-slate-500"}`}>{item}</span>
            ))}
          </div>

          <div className="mt-6 grid overflow-hidden rounded-[30px] border border-black/[.07] bg-white shadow-[0_35px_100px_rgba(22,40,48,.1)] lg:grid-cols-[.78fr_1.22fr]">
            <div className="p-8 sm:p-12">
              <div className="grid size-11 place-items-center rounded-xl bg-[#dff7f3] text-[#14736d]"><FileCheck2 className="size-5" /></div>
              <h3 className="mt-8 text-3xl font-semibold tracking-[-.04em]">Structured intake without another inbox.</h3>
              <p className="mt-4 leading-7 text-slate-600">Create a case from the web or API, align core operational fields, and route ownership before documentation work begins.</p>
              <div className="mt-9 space-y-4">
                {["Organization-scoped case records", "Priority and service-date routing", "Source-aware activity history"].map((item) => (
                  <p key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700"><span className="grid size-6 place-items-center rounded-full bg-emerald-50"><Check className="size-3.5 text-emerald-600" /></span>{item}</p>
                ))}
              </div>
            </div>
            <div className="min-h-[520px] bg-[#10242d] p-5 sm:p-8">
              <IntakePanel />
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-[#10252e] px-6 py-28 text-white">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Workflow</p>
              <h2 className="mt-5 max-w-xl text-5xl font-semibold leading-[.98] tracking-[-.055em]">One case. One owner. One visible next move.</h2>
            </div>
            <p className="max-w-xl self-end text-lg leading-8 text-slate-400">Authora preserves context as the work moves across clinical review, payer requirements, submission, follow-up, and appeal.</p>
          </div>
          <div className="mt-16 grid border-y border-white/10 md:grid-cols-4">
            {workflow.map(([number, title, text], index) => (
              <article key={number} className={`relative py-9 md:px-7 ${index > 0 ? "border-t border-white/10 md:border-l md:border-t-0" : ""}`}>
                <span className="text-xs font-semibold text-[#79e4d9]">{number}</span>
                <h3 className="mt-10 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-16 grid gap-4 lg:grid-cols-3">
            <Benefit icon={Clock3} title="Operational clarity" text="Due dates, ownership, readiness, and risk stay visible in one queue." />
            <Benefit icon={BrainCircuit} title="Human-reviewed AI" text="Operational recommendations remain advisory and exclude patient identity." />
            <Benefit icon={Fingerprint} title="Accountable history" text="Connection, installation, and AI events are tenant-scoped and auditable." />
          </div>
        </div>
      </section>

      <section id="salesforce" className="px-6 py-28">
        <div className="mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <SalesforceLogo className="h-20 w-28" />
            <p className="mt-7 text-xs font-semibold uppercase tracking-[.18em] text-[#0879b5]">Salesforce connected</p>
            <h2 className="mt-5 text-5xl font-semibold leading-[.98] tracking-[-.055em]">Deploy the operating model into the org your team already knows.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">After secure OAuth, Authora assesses the org and queues a reviewed metadata package containing objects, tabs, permission sets, validation rules, Flow, and Lightning pages.</p>
            <Link href="/login" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0b5cab] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(11,92,171,.22)]">Connect Salesforce <ArrowRight className="size-4" /></Link>
          </div>
          <SalesforceInstallPanel />
        </div>
      </section>

      <section id="security" className="px-6 pb-28">
        <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[36px] bg-[#bdf1e8] px-8 py-16 sm:px-14 lg:px-20">
          <div className="absolute right-0 top-0 size-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/50 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#166e68]">Ready for accountable operations?</p>
              <h2 className="mt-5 max-w-3xl text-5xl font-semibold leading-[.96] tracking-[-.055em] text-[#102d34]">Bring the authorization workflow into focus.</h2>
              <p className="mt-6 max-w-2xl leading-7 text-[#365e63]">Start a tenant-isolated workspace, connect Salesforce, and validate the installation plan before enabling metadata deployment.</p>
            </div>
            <Link href="/register" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#102d34] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(16,45,52,.2)]">Request access <ArrowRight className="size-4 transition group-hover:translate-x-1" /></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function DotField() {
  return <div className="pointer-events-none absolute inset-0" aria-hidden="true">{Array.from({ length: 24 }).map((_, index) => <span key={index} className="authora-particle absolute size-1 rounded-full bg-[#36b9ae]/40" style={{ left: `${3 + (index * 19) % 94}%`, top: `${8 + (index * 31) % 78}%`, animationDelay: `${index * -.31}s` }} />)}</div>;
}

function ProductWindow() {
  return (
    <div className="macbook-device text-left">
      <div className="macbook-screen-shell">
        <div className="macbook-camera"><span /></div>
        <div className="overflow-hidden rounded-[12px] bg-[#0c1721]">
          <div className="flex h-11 items-center border-b border-black/10 bg-[#edf0ef] px-4">
            <div className="flex gap-2"><span className="size-3 rounded-full bg-[#ff5f57] shadow-inner" /><span className="size-3 rounded-full bg-[#febc2e] shadow-inner" /><span className="size-3 rounded-full bg-[#28c840] shadow-inner" /></div>
            <div className="mx-auto flex items-center gap-2 rounded-lg border border-black/[.07] bg-white/75 px-12 py-1.5 text-[9px] text-slate-400 shadow-sm"><LockDot /> app.authora.health</div>
          </div>
          <div className="grid min-h-[520px] grid-cols-[62px_1fr]">
            <aside className="border-r border-white/[.07] bg-[#09131c] py-5">
              <div className="mx-auto grid size-9 place-items-center rounded-xl bg-[#76e4df] font-bold text-[#071019]">A</div>
              <div className="mt-8 space-y-3">{[LayoutDashboard, FileCheck2, Network, ShieldCheck].map((Icon, index) => <div key={index} className={`mx-auto grid size-9 place-items-center rounded-xl ${index === 0 ? "bg-white/10 text-white" : "text-slate-600"}`}><Icon className="size-4" /></div>)}</div>
            </aside>
            <div>
              <div className="flex items-center justify-between border-b border-white/[.07] px-6 py-4 text-white"><div><p className="text-[9px] uppercase tracking-wider text-slate-500">Operations</p><p className="mt-1 text-sm font-semibold">Authorization command center</p></div><span className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[.06] px-3 py-1.5 text-[9px] text-emerald-300"><CircleCheck className="size-3" /> Workspace ready</span></div>
              <div className="grid grid-cols-3 border-b border-white/[.07] text-white">{[["Open cases", "24"], ["Due today", "6"], ["Ready", "11"]].map(([label, value]) => <div key={label} className="border-r border-white/[.07] p-4 last:border-0"><p className="text-[9px] text-slate-500">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>)}</div>
              <div className="p-5 text-white"><div className="mb-4 flex items-center justify-between"><p className="text-xs font-semibold">Priority work queue</p><span className="text-[9px] text-slate-500">Updated just now</span></div>
                <div className="overflow-hidden rounded-xl border border-white/[.07]">{cases.map(([id, service, status, date, tone]) => <div key={id} className="grid grid-cols-[.75fr_1.2fr_1.25fr_.65fr] gap-2 border-b border-white/[.06] bg-[#0a141e] px-4 py-3.5 text-[9px] last:border-0"><span className="font-medium text-[#76e4df]">{id}</span><span>{service}</span><span className={tone === "green" ? "text-emerald-300" : tone === "amber" ? "text-amber-300" : "text-sky-300"}>{status}</span><span className="text-right text-slate-500">{date}</span></div>)}</div>
                <div className="mt-4 grid grid-cols-2 gap-4"><div className="rounded-xl border border-white/[.07] bg-[#0a141e] p-4"><p className="text-[9px] text-slate-500">Documentation readiness</p><div className="mt-4 h-1.5 rounded-full bg-white/[.07]"><div className="h-full w-[78%] rounded-full bg-[#76e4df]" /></div><div className="mt-3 flex justify-between text-[9px]"><span>18 complete</span><span className="text-slate-500">5 need review</span></div></div><div className="rounded-xl border border-white/[.07] bg-[#0a141e] p-4"><p className="text-[9px] text-slate-500">Salesforce connection</p><div className="mt-3 flex items-center gap-3"><SalesforceLogo className="h-8 w-12" /><div><p className="text-[9px] font-medium">Connected org</p><p className="text-[8px] text-emerald-300">Healthy</p></div></div></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MacKeyboard />
    </div>
  );
}

function LockDot() {
  return <span className="relative block h-2.5 w-2 rounded-[2px] border border-slate-400 before:absolute before:-top-1.5 before:left-1/2 before:h-1.5 before:w-1.5 before:-translate-x-1/2 before:rounded-t-full before:border before:border-b-0 before:border-slate-400" aria-hidden="true" />;
}

function MacKeyboard() {
  const rows = [
    ["esc","1","2","3","4","5","6","7","8","9","0","-","=","⌫"],
    ["tab","Q","W","E","R","T","Y","U","I","O","P","[","]","\\"],
    ["caps","A","S","D","F","G","H","J","K","L",";",["return","wide"]],
    ["shift","Z","X","C","V","B","N","M",",",".","/",["shift","wide"]],
    ["","","","⌘",["","space"],"⌘","","←","↑","→"],
  ] as const;

  return (
    <div className="macbook-base" aria-hidden="true">
      <div className="macbook-keyboard">
        {rows.map((row, rowIndex) => <div key={rowIndex} className="mac-key-row">{row.map((key, keyIndex) => {
          const value = Array.isArray(key) ? key[0] : key;
          const size = Array.isArray(key) ? key[1] : "";
          return <span key={`${value}-${keyIndex}`} className={`mac-key ${size === "wide" ? "mac-key-wide" : ""} ${size === "space" ? "mac-key-space" : ""}`}>{value}</span>;
        })}</div>)}
      </div>
      <div className="macbook-trackpad" />
      <div className="macbook-lip" />
    </div>
  );
}

function IntakePanel() {
  return <div className="h-full rounded-[22px] border border-white/10 bg-[#0b1820] p-5 text-white shadow-2xl"><div className="flex items-center justify-between border-b border-white/10 pb-5"><div><p className="text-[10px] uppercase tracking-[.16em] text-slate-500">New authorization</p><p className="mt-1 text-sm font-semibold">Case intake</p></div><span className="rounded-full bg-cyan-300/10 px-3 py-1 text-[10px] text-cyan-200">Draft</span></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{[["Service", "Knee MRI"], ["Priority", "Urgent"], ["Payer", "Health Plan"], ["Service date", "Aug 04, 2026"]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/[.08] bg-white/[.035] p-4"><p className="text-[9px] uppercase tracking-wider text-slate-600">{label}</p><p className="mt-2 text-xs font-medium">{value}</p></div>)}</div><div className="mt-4 rounded-xl border border-amber-300/15 bg-amber-300/[.05] p-4"><p className="flex items-center gap-2 text-xs font-semibold text-amber-200"><Clock3 className="size-4" /> Evidence review needed</p><p className="mt-2 text-[10px] leading-5 text-slate-400">Two operational requirements should be reviewed before submission.</p></div><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#76e4df] py-3 text-xs font-semibold text-[#071019]">Create authorization <ArrowRight className="size-3.5" /></button></div>;
}

function SalesforceInstallPanel() {
  const steps = [["Connection verified", "Complete"], ["Org capability assessment", "Complete"], ["Metadata package validation", "Ready"], ["Admin deployment approval", "Required"]];
  return <div className="rounded-[28px] border border-black/[.07] bg-white p-5 shadow-[0_35px_100px_rgba(22,40,48,.11)] sm:p-8"><div className="flex items-center justify-between border-b border-black/[.06] pb-6"><div><p className="text-xs font-semibold text-slate-400">Authora Health package</p><p className="mt-1 text-lg font-semibold">Salesforce org installation</p></div><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700">Connection healthy</span></div><div className="mt-4">{steps.map(([label, status], index) => <div key={label} className="flex items-center gap-4 border-b border-black/[.06] py-4 last:border-0"><span className={`grid size-8 place-items-center rounded-full ${index < 2 ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{index < 2 ? <Check className="size-4" /> : <span className="text-[10px] font-bold">0{index + 1}</span>}</span><span className="flex-1 text-sm font-semibold">{label}</span><span className="text-[10px] text-slate-400">{status}</span></div>)}</div><div className="mt-5 grid grid-cols-3 gap-2">{["Objects", "Flows", "App pages"].map((item) => <div key={item} className="rounded-xl bg-[#f4f7f6] px-3 py-4 text-center text-[10px] font-semibold text-slate-500">{item}</div>)}</div></div>;
}

function Benefit({ icon: Icon, title, text }: { icon: typeof Workflow; title: string; text: string }) {
  return <article className="rounded-2xl border border-white/10 bg-white/[.035] p-7"><div className="grid size-10 place-items-center rounded-xl bg-[#79e4d9]/10 text-[#79e4d9]"><Icon className="size-5" /></div><h3 className="mt-8 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p></article>;
}
