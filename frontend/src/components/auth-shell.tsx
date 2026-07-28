"use client";

import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { BrandMark } from "@/components/brand";
import { SalesforceLogo } from "@/components/salesforce-logo";
import { API_URL, apiFetch, initializeCsrf } from "@/lib/api";

export function AuthShell({ mode }: { mode: "login" | "register" }) {
  const register = mode === "register";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      await initializeCsrf();
      const response = await apiFetch(`/api/auth/${register ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          response.status === 419
            ? "Your secure session expired. Refresh the page and try again."
            : body?.message ?? "We could not complete the request.",
        );
      }
      window.location.href = "/dashboard";
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not complete the request.");
      setLoading(false);
    }
  }

  return (
    <main className="auth-grid relative min-h-screen overflow-hidden bg-[#05080d] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(6,182,212,.19),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(16,185,129,.12),transparent_30%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[1.08fr_.92fr]">
        <section className="hidden flex-col justify-between border-r border-white/[.07] p-14 lg:flex">
          <BrandMark />
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-1.5 text-xs text-cyan-200"><LockKeyhole className="size-3.5" /> Secure authorization operations</span>
            <h1 className="mt-7 text-5xl font-semibold leading-[1.02] tracking-[-.05em]">{register ? "Build an accountable authorization operation." : "Your authorization command center is ready."}</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">Coordinate intake, clinical evidence, payer requirements, decisions, and appeals without losing the audit trail.</p>
            <div className="mt-9 grid gap-3">
              {["One tenant-scoped workspace for every authorization", "Salesforce-connected ownership and workflow status", "Human-reviewed decisions with source evidence"].map(item => <p key={item} className="flex items-center gap-3 rounded-2xl border border-white/[.07] bg-white/[.025] px-4 py-3.5 text-sm text-slate-300"><span className="grid size-7 place-items-center rounded-lg bg-cyan-300/10"><Check className="size-3.5 text-cyan-300" /></span>{item}</p>)}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500"><ShieldCheck className="size-4 text-emerald-300" /> Encrypted sessions · Tenant isolation · Audited access</div>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-10">
          <div className="w-full max-w-[470px] rounded-[30px] border border-white/10 bg-[#0b111a]/95 p-7 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-xl sm:p-10">
            <div className="mb-10 lg:hidden"><BrandMark /></div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-300">{register ? "Create workspace" : "Secure sign in"}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-.03em]">{register ? "Start with Authora" : "Welcome back"}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{register ? "Create your organization’s secure operations workspace." : "Sign in with your work account or connected Salesforce identity."}</p>

            <a href={`${API_URL}/auth/salesforce/redirect`} className="group mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-[#2eaeef]/30 bg-[#0b5cab] px-4 py-3 text-sm font-semibold shadow-[0_12px_35px_rgba(11,92,171,.22)] transition hover:-translate-y-0.5 hover:bg-[#106fc7]">
              <SalesforceLogo className="h-7 w-10 shrink-0" /> Continue with Salesforce
            </a>
            <p className="mt-3 text-center text-[11px] leading-5 text-slate-600">Uses Salesforce OAuth. Authora never receives your Salesforce password.</p>

            <div className="my-7 flex items-center gap-4"><div className="h-px flex-1 bg-white/10" /><span className="text-xs text-slate-600">or use email</span><div className="h-px flex-1 bg-white/10" /></div>

            <form onSubmit={submit} className="space-y-4">
              {register && <Field label="Organization name" name="organization_name" placeholder="Northstar Orthopedics" autoComplete="organization" />}
              {register && <Field label="Your name" name="name" placeholder="Morgan Reed" autoComplete="name" />}
              <Field label="Work email" name="email" type="email" placeholder="you@organization.com" autoComplete="email" />
              <Field label="Password" name="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" autoComplete={register ? "new-password" : "current-password"} trailing={<button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="text-slate-500 hover:text-white">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>} />
              {register && <Field label="Confirm password" name="password_confirmation" type={showPassword ? "text" : "password"} placeholder="Repeat your password" autoComplete="new-password" />}
              {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
              <button disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:opacity-60">
                {loading ? "Please wait…" : register ? "Create secure workspace" : "Sign in"} {!loading && <ArrowRight className="size-4 transition group-hover:translate-x-1" />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              {register ? "Already have an account?" : "New to Authora?"}{" "}
              <Link href={register ? "/login" : "/register"} className="font-semibold text-cyan-300 hover:text-cyan-200">{register ? "Sign in" : "Create workspace"}</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, trailing, ...props }: { label: string; name: string; type?: string; placeholder: string; autoComplete: string; trailing?: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-300">{label}<span className="mt-2 flex items-center rounded-xl border border-white/10 bg-white/[.045] pr-4 transition focus-within:border-cyan-300/45 focus-within:ring-4 focus-within:ring-cyan-300/5"><input required {...props} className="min-w-0 flex-1 bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-700" />{trailing}</span></label>;
}
