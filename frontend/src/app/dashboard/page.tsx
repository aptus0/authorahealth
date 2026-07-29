"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BrainCircuit, CircleCheck, Clock3, FileCheck2, Link2, LoaderCircle, TrendingUp } from "lucide-react";
import { apiFetch } from "@/lib/api";

type DashboardData = {
  metrics: { open: number; due_today: number; approved: number; ready: number; revenue_at_risk: number };
  cases: Array<{ id: string; number: string; patient: string; service: string; payer: string; status: string; priority: string; due: string | null }>;
  integrations: {
    salesforce: null | { status: string; provisioning_status: string; provisioning_progress: number; provisioning_step?: string };
    ai: null | { status: string; model: string };
  };
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    apiFetch("/api/dashboard")
      .then(async response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) return <div className="grid min-h-[60vh] place-items-center"><LoaderCircle className="size-6 animate-spin text-teal-700" /></div>;

  const sfConnected = Boolean(data.integrations.salesforce);
  const aiConnected = Boolean(data.integrations.ai);
  const demoMode = data.cases.length === 0;
  const displayCases = demoMode ? [
    { id: "demo-1", number: "AU-2841", patient: "Jordan M.", service: "73721 · Knee MRI", payer: "Aetna", status: "documentation_required", priority: "urgent", due: "2026-07-29" },
    { id: "demo-2", number: "AU-2837", patient: "Taylor R.", service: "97110 · Physical therapy", payer: "UnitedHealthcare", status: "payer_review", priority: "routine", due: "2026-07-31" },
    { id: "demo-3", number: "AU-2829", patient: "Casey L.", service: "62323 · Lumbar injection", payer: "Cigna", status: "ready", priority: "routine", due: "2026-08-02" },
  ] : data.cases;
  const displayMetrics = demoMode
    ? { open: 24, due_today: 6, approved: 18, ready: 11, revenue_at_risk: 48250 }
    : data.metrics;
  const cards = [
    [FileCheck2, "Open authorizations", displayMetrics.open, `${displayMetrics.due_today} due today`, "text-cyan-700 bg-cyan-50"],
    [CircleCheck, "Ready to submit", displayMetrics.ready, "Human review queue", "text-emerald-700 bg-emerald-50"],
    [TrendingUp, "Approved", displayMetrics.approved, "Current workspace", "text-violet-700 bg-violet-50"],
    [Clock3, "Revenue at risk", `$${Math.round(displayMetrics.revenue_at_risk).toLocaleString()}`, "Documentation and denials", "text-amber-700 bg-amber-50"],
  ] as const;

  return <div>
    <section className="relative overflow-hidden rounded-[28px] bg-[#102933] px-7 py-8 text-white shadow-[0_35px_90px_rgba(16,41,51,.22)] sm:px-9 sm:py-10">
      <div className="absolute -right-24 -top-28 size-80 rounded-full border border-cyan-200/10 bg-cyan-200/[.04]" />
      <div className="absolute right-32 top-16 size-2 animate-pulse rounded-full bg-[#76e4df] shadow-[0_0_25px_8px_rgba(118,228,223,.22)]" />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div><div className="flex flex-wrap items-center gap-3"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#76e4df]">Authorization command center</p>{demoMode && <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">Demo workspace</span>}</div><h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-.045em] sm:text-4xl">Know what is ready, what is blocked, and who owns the next move.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">Live operational visibility across cases, payer work, Salesforce, and human-reviewed AI.</p></div>
        <div className="flex flex-wrap gap-3"><Link href="/dashboard/cases" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#102933]">New authorization <ArrowRight className="size-4" /></Link><Link href="/dashboard/integrations" className="rounded-xl border border-white/15 bg-white/[.06] px-4 py-3 text-sm font-semibold backdrop-blur">Integration control</Link></div>
      </div>
    </section>

    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([Icon, label, value, note, tone]) => <section key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(35,55,65,.06)]"><span className={`grid size-10 place-items-center rounded-xl ${tone}`}><Icon className="size-5" /></span><p className="mt-6 text-3xl font-semibold tracking-[-.04em]">{value}</p><p className="mt-1 text-sm font-semibold">{label}</p><p className="mt-2 text-xs text-slate-400">{note}</p></section>)}</div>

    <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(35,55,65,.06)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="font-semibold">Priority queue</h2><p className="mt-1 text-xs text-slate-400">Ordered by due date and operational risk.</p></div><Link href="/dashboard/cases" className="text-xs font-semibold text-teal-700">View all</Link></div>
        <div className="overflow-x-auto"><table className="min-w-full text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase tracking-[.12em] text-slate-400"><tr>{["Case","Patient","Service","Payer","Status","Due"].map(label => <th key={label} className="px-5 py-3 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{displayCases.map(item => <tr key={item.id} className="hover:bg-teal-50/30"><td className="whitespace-nowrap px-5 py-4 font-semibold text-teal-700">{item.number}</td><td className="whitespace-nowrap px-5 py-4">{item.patient}</td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{item.service}</td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{item.payer}</td><td className="whitespace-nowrap px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold capitalize">{item.status.replaceAll("_"," ")}</span></td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{item.due ?? "Not set"}</td></tr>)}</tbody></table></div>
      </section>

      <div className="space-y-5">
        <StatusCard icon={Link2} title="Salesforce" connected={sfConnected} status={data.integrations.salesforce?.provisioning_step ?? "Connect an org to begin automated setup."} href="/dashboard/integrations" />
        <StatusCard icon={BrainCircuit} title="Authora Intelligence" connected={aiConnected} status={aiConnected ? `${data.integrations.ai?.model} · ${data.integrations.ai?.status}` : "Add your organization API key securely."} href="/dashboard/settings" />
      </div>
    </div>
  </div>;
}

function StatusCard({ icon: Icon, title, connected, status, href }: { icon: typeof Link2; title: string; connected: boolean; status: string; href: string }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(35,55,65,.05)]"><div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl bg-[#e8f7f5] text-teal-700"><Icon className="size-5" /></span><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${connected ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{connected ? "Connected" : "Action needed"}</span></div><h2 className="mt-5 font-semibold">{title}</h2><p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{status}</p><Link href={href} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-teal-700">Manage <ArrowRight className="size-3.5" /></Link></section>;
}
