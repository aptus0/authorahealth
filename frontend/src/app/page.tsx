"use client";

import { motion } from "motion/react";
import {
  ArrowRight, ChartNoAxesCombined, Check, Clock3, FileCheck2,
  Link2, LockKeyhole, Network, ShieldCheck, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/brand";

const features = [
  { icon: FileCheck2, title: "Documentation readiness", text: "Catch missing clinical evidence before a case reaches the payer." },
  { icon: Clock3, title: "SLA-aware work queues", text: "Prioritize every case by service date, urgency, and revenue exposure." },
  { icon: Network, title: "Payer intelligence", text: "Turn changing payer requirements into reviewed, versioned workflows." },
  { icon: ChartNoAxesCombined, title: "Revenue visibility", text: "Connect authorization outcomes to delays, denials, and protected revenue." },
  { icon: Link2, title: "Salesforce connected", text: "Keep CRM ownership and operational status aligned without duplicating uncontrolled PHI." },
  { icon: ShieldCheck, title: "Audit-ready by design", text: "Capture accountable human decisions, source evidence, and every material change." },
];

const steps = [
  ["01", "Intake", "Bring scheduled services, coverage, and clinical context into one case."],
  ["02", "Verify", "Apply payer-specific rules and surface documentation gaps."],
  ["03", "Submit", "Build a complete submission package and preserve the evidence trail."],
  ["04", "Resolve", "Track decisions, additional information, denials, and appeals."],
];

const proof = [
  ["25%", "less handling time", "Target reduction in manual work per authorization"],
  ["40%", "fewer late cases", "Target reduction in cases missing service-date SLAs"],
  ["1", "operational truth", "A shared queue for clinical, authorization, and revenue teams"],
];

function Brand() {
  return <BrandMark />;
}

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#05080d] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[850px] bg-[radial-gradient(circle_at_50%_0%,rgba(15,118,110,.38),transparent_55%)]" />
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Brand />
        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#platform" className="hover:text-white">Platform</a>
          <a href="#workflow" className="hover:text-white">Workflow</a>
          <a href="#security" className="hover:text-white">Security</a>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white sm:block">Sign in</Link>
          <Link href="/register" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">Start free</Link>
        </div>
      </nav>

      <section className="relative mx-auto max-w-7xl px-6 pb-28 pt-20 text-center sm:pt-28">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-2 text-xs font-medium text-cyan-200 backdrop-blur">
            <Sparkles className="size-3.5" /> The authorization operating system for specialty care
          </span>
          <h1 className="mx-auto mt-8 max-w-5xl text-balance text-5xl font-semibold leading-[.98] tracking-[-.055em] sm:text-7xl lg:text-[92px]">
            Care should not wait on <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">operational chaos.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-8 text-slate-400">
            Authora unifies prior authorization intake, documentation readiness, payer follow-up, decisions, and appeals in one accountable workflow.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-3.5 font-semibold text-slate-950 shadow-[0_0_45px_rgba(34,211,238,.18)]">
              Create your workspace <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/login" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur hover:bg-white/10">Connect with Salesforce</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .7 }} className="relative mx-auto mt-20 max-w-6xl rounded-[28px] border border-white/10 bg-white/[.035] p-3 shadow-[0_45px_140px_rgba(0,0,0,.55)] backdrop-blur">
          <div className="absolute -inset-px -z-10 rounded-[28px] bg-gradient-to-r from-cyan-400/20 via-transparent to-emerald-400/20 blur-xl" />
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f17] text-left">
            <div className="flex h-10 items-center gap-2 border-b border-white/10 bg-[#111824] px-4"><span className="size-3 rounded-full bg-[#ff5f57]" /><span className="size-3 rounded-full bg-[#febc2e]" /><span className="size-3 rounded-full bg-[#28c840]" /><span className="ml-3 text-[11px] text-slate-500">Authora Health — Authorization Operations</span></div>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div><p className="text-xs text-cyan-300">Authorization operations</p><p className="mt-1 font-medium">Morning command center</p></div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">All systems healthy</span>
            </div>
            <div className="grid gap-px bg-white/10 md:grid-cols-4">
              {[["4 stages", "Intake to resolution"], ["1 queue", "Operational ownership"], ["OAuth 2.0", "Salesforce connection"], ["Tenant scoped", "Data boundary"]].map(([value, label]) => (
                <div key={label} className="bg-[#0a0f17] p-6"><p className="text-3xl font-semibold tracking-tight">{value}</p><p className="mt-2 text-sm text-slate-500">{label}</p></div>
              ))}
            </div>
            <div className="grid lg:grid-cols-[1.4fr_.6fr]">
              <div className="p-6">
                <div className="mb-4 flex justify-between"><p className="text-sm font-medium">Priority queue</p><p className="text-xs text-slate-500">Sorted by risk</p></div>
                {[["AUTH-10428", "MRI — Knee", "Documentation required", "Today"], ["AUTH-10421", "Physical therapy", "Payer review", "Tomorrow"], ["AUTH-10416", "Lumbar injection", "Appeal due", "Jul 31"]].map((row) => (
                  <div key={row[0]} className="grid grid-cols-[.8fr_1.2fr_1.2fr_.6fr] gap-3 border-t border-white/5 py-4 text-xs sm:text-sm"><span className="text-cyan-300">{row[0]}</span><span>{row[1]}</span><span className="text-slate-400">{row[2]}</span><span className="text-right text-slate-500">{row[3]}</span></div>
                ))}
              </div>
              <div className="border-t border-white/10 p-6 lg:border-l lg:border-t-0">
                <p className="text-sm font-medium">Readiness signal</p>
                <div className="mt-8 grid place-items-center">
                  <div className="grid size-36 place-items-center rounded-full bg-[conic-gradient(#5eead4_87%,#17202d_0)] p-3"><div className="grid size-full place-items-center rounded-full bg-[#0a0f17] text-3xl font-semibold">87%</div></div>
                </div>
                <p className="mt-6 text-center text-xs leading-5 text-slate-500">Clinical and payer requirements verified before submission.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="platform" className="mx-auto max-w-7xl px-6 py-28">
        <div className="max-w-2xl"><p className="eyebrow">Built for the work</p><h2 className="section-title">From fragmented tasks to a measurable operation.</h2></div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }, i) => (
            <motion.article key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .06 }} className="group rounded-3xl border border-white/10 bg-white/[.035] p-7 transition hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/[.055]">
              <div className="grid size-11 place-items-center rounded-2xl border border-cyan-300/15 bg-cyan-300/5 text-cyan-300"><Icon className="size-5" /></div>
              <h3 className="mt-8 text-lg font-semibold">{title}</h3><p className="mt-3 leading-7 text-slate-400">{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="workflow" className="border-y border-white/10 bg-white/[.02]">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="max-w-2xl"><p className="eyebrow">One continuous workflow</p><h2 className="section-title">Every handoff has an owner, a deadline, and evidence.</h2></div>
          <div className="mt-16 grid gap-4 lg:grid-cols-4">
            {steps.map(([number, title, text]) => <div key={number} className="relative rounded-3xl border border-white/10 bg-[#080d14] p-7"><span className="text-sm text-cyan-300">{number}</span><h3 className="mt-12 text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-slate-400">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-teal-500/15 to-transparent lg:grid-cols-2">
          <div className="p-8 sm:p-12 lg:p-16"><p className="eyebrow">Salesforce, connected responsibly</p><h2 className="section-title">CRM context in. Operational truth out.</h2><p className="mt-6 max-w-xl leading-8 text-slate-400">Connect through Salesforce External Client App OAuth. Keep ownership, cases, and task status aligned while Authora protects workflow evidence and prevents uncontrolled clinical-document duplication.</p><ul className="mt-8 space-y-3 text-sm text-slate-300">{["Encrypted server-side tokens", "Tenant-bound Salesforce org mapping", "Audited connection lifecycle", "Minimum required API scopes"].map(x => <li key={x} className="flex gap-3"><Check className="size-5 text-cyan-300" />{x}</li>)}</ul></div>
          <div className="grid min-h-96 place-items-center border-t border-white/10 bg-[radial-gradient(circle,rgba(34,211,238,.16),transparent_60%)] p-10 lg:border-l lg:border-t-0"><div className="relative grid size-52 place-items-center rounded-full border border-cyan-300/20 bg-cyan-300/5"><div className="grid size-28 place-items-center rounded-[32px] bg-[#0b5cab] text-3xl font-bold shadow-[0_0_70px_rgba(11,92,171,.5)]">SF</div><span className="absolute -right-8 top-8 rounded-xl border border-white/10 bg-[#111827] px-4 py-2 text-xs text-emerald-300">Connected</span><span className="absolute -left-12 bottom-8 rounded-xl border border-white/10 bg-[#111827] px-4 py-2 text-xs text-cyan-200">Audit logged</span></div></div>
        </div>
      </section>

      <section id="security" className="mx-auto max-w-7xl px-6 pb-28">
        <div className="grid gap-4 md:grid-cols-3">{proof.map(([value, title, text]) => <div key={title} className="rounded-3xl border border-white/10 p-8"><p className="text-4xl font-semibold text-cyan-200">{value}</p><p className="mt-4 font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>)}</div>
        <div className="mt-20 rounded-[32px] border border-cyan-300/20 bg-cyan-300/[.06] px-6 py-16 text-center"><LockKeyhole className="mx-auto size-8 text-cyan-300" /><h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Build a calmer authorization operation.</h2><p className="mx-auto mt-5 max-w-xl text-slate-400">Start with a secure workspace. Connect Salesforce when your organization is ready.</p><Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-slate-950">Start your workspace <ArrowRight className="size-4" /></Link></div>
      </section>

      <footer className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><Brand /><p>© 2026 Authora Health. Prior authorization, accountable.</p><div className="flex gap-5"><span>Privacy</span><span>Security</span><span>Terms</span></div></div></footer>
    </main>
  );
}
