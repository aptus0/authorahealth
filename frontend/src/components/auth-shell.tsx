"use client";

import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { BrandMark } from "@/components/brand";
import { SalesforceLogo } from "@/components/salesforce-logo";
import { API_URL, apiFetch, initializeCsrf } from "@/lib/api";

export function AuthShell({ mode, salesforceUnavailable = false }: { mode: "login" | "register"; salesforceUnavailable?: boolean }) {
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(6,182,212,.22),transparent_30%),radial-gradient(circle_at_88%_76%,rgba(16,185,129,.15),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} className="authora-particle absolute size-1 rounded-full bg-cyan-200/50" style={{ left: `${5 + (index * 17) % 92}%`, top: `${8 + (index * 29) % 84}%`, animationDelay: `${index * -0.37}s` }} />
        ))}
      </div>
      <div className="relative mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[1.08fr_.92fr]">
        <section className="hidden flex-col justify-between border-r border-white/[.07] p-14 lg:flex">
          <BrandMark />
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-1.5 text-xs text-cyan-200"><LockKeyhole className="size-3.5" /> Secure authorization operations</span>
            <h1 className="mt-7 text-5xl font-semibold leading-[1.02] tracking-[-.055em]">{register ? "Build an accountable authorization operation." : "Clinical operations, finally in one clear view."}</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">Coordinate intake, clinical evidence, payer requirements, decisions, and appeals without losing the audit trail.</p>
            <div className="mt-9 grid gap-3">
              {["One tenant-scoped workspace for every authorization", "Salesforce-connected ownership and workflow status", "Human-reviewed decisions with source evidence"].map(item => <p key={item} className="flex items-center gap-3 rounded-2xl border border-white/[.07] bg-white/[.025] px-4 py-3.5 text-sm text-slate-300"><span className="grid size-7 place-items-center rounded-lg bg-cyan-300/10"><Check className="size-3.5 text-cyan-300" /></span>{item}</p>)}
            </div>
            <div className="mt-8 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/[.08] bg-black/15 shadow-[0_30px_80px_rgba(0,0,0,.25)] backdrop-blur">
              {[["24", "Open cases"], ["94%", "SLA visibility"], ["Live", "Salesforce"]].map(([value, label]) => (
                <div key={label} className="border-r border-white/[.08] px-4 py-5 last:border-0">
                  <p className="text-xl font-semibold tracking-[-.03em] text-white">{value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[.12em] text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500"><ShieldCheck className="size-4 text-emerald-300" /> Encrypted sessions · Tenant isolation · Audited access</div>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-10">
          <div className="relative w-full max-w-[470px] rounded-[32px] border border-white/[.12] bg-[linear-gradient(145deg,rgba(17,27,39,.98),rgba(8,13,21,.98))] p-7 shadow-[0_45px_120px_rgba(0,0,0,.65),0_1px_0_rgba(255,255,255,.08)_inset] backdrop-blur-2xl sm:p-10">
            <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
            <div className="mb-10 lg:hidden"><BrandMark /></div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-cyan-300"><Sparkles className="size-3.5" />{register ? "Create workspace" : "Secure sign in"}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-.03em]">{register ? "Start with Authora" : "Welcome back"}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{register ? "Create your organization’s secure operations workspace." : "Sign in with your work account or connected Salesforce identity."}</p>

            <a href={`${API_URL}/auth/salesforce/redirect`} className="group mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-[#2eaeef]/30 bg-[#0b5cab] px-4 py-3 text-sm font-semibold shadow-[0_12px_35px_rgba(11,92,171,.22)] transition hover:-translate-y-0.5 hover:bg-[#106fc7]">
              <SalesforceLogo className="h-7 w-10 shrink-0" /> Continue with Salesforce
            </a>
            {salesforceUnavailable && (
              <p role="alert" className="mt-3 rounded-xl border border-amber-300/20 bg-amber-300/[.08] px-4 py-3 text-xs leading-5 text-amber-100">
                Salesforce sign-in is not configured yet. Add the Connected App client ID and secret to the API environment, then try again. Email sign-in remains available.
              </p>
            )}
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
