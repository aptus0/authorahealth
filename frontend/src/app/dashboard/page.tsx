"use client";

import { ArrowUpRight, CircleUserRound, FileCheck2, Link2, LogOut, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/brand";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.authora-health.test";

type User = { name: string; email: string; organization?: { name: string; subscription?: { plan: string; status: string } } };

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: "include", headers: { Accept: "application/json" } })
      .then(async response => {
        if (!response.ok) throw new Error();
        setUser((await response.json()).user);
      })
      .catch(() => window.location.href = "/login")
      .finally(() => setChecking(false));
  }, []);

  async function logout() {
    await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include", headers: { Accept: "application/json" } });
    window.location.href = "/";
  }

  if (checking) return <main className="grid min-h-screen place-items-center bg-[#05080d] text-cyan-300">Securing your workspace…</main>;

  return (
    <main className="min-h-screen bg-[#070b11] text-white">
      <nav className="border-b border-white/10 bg-[#090e16]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <BrandMark />
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-medium">{user?.name}</p><p className="text-xs text-slate-500">{user?.organization?.name}</p></div><button onClick={logout} aria-label="Sign out" className="grid size-10 place-items-center rounded-xl border border-white/10 text-slate-400 hover:text-white"><LogOut className="size-4" /></button></div>
        </div>
      </nav>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-medium text-cyan-300">Authorization operations</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome, {user?.name?.split(" ")[0]}.</h1>
        <p className="mt-2 text-slate-500">Your secure workspace is ready for configuration.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            [FileCheck2, "Authorization intake", "Create the first operational case and documentation checklist."],
            [Link2, "Connect Salesforce", "Link CRM ownership, cases, and task status through secure OAuth."],
            [ShieldCheck, "Security posture", "Tenant isolation, encrypted sessions, and audit foundations are active."],
          ].map(([Icon, title, text]) => {
            const Component = Icon as typeof FileCheck2;
            return <article key={title as string} className="rounded-3xl border border-white/10 bg-white/[.035] p-7"><Component className="size-6 text-cyan-300" /><h2 className="mt-8 text-lg font-semibold">{title as string}</h2><p className="mt-3 min-h-14 text-sm leading-6 text-slate-500">{text as string}</p><button className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">Configure <ArrowUpRight className="size-4" /></button></article>;
          })}
        </div>
        <div className="mt-6 flex items-center justify-between rounded-3xl border border-white/10 bg-[#0b111a] p-6"><div className="flex items-center gap-4"><CircleUserRound className="size-9 text-slate-500" /><div><p className="font-medium">{user?.email}</p><p className="mt-1 text-xs text-slate-500">Plan: {user?.organization?.subscription?.plan ?? "trial"}</p></div></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">{user?.organization?.subscription?.status ?? "active"}</span></div>
      </div>
    </main>
  );
}
