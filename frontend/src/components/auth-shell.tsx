"use client";

import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { BrandMark } from "@/components/brand";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.authora-health.test";

export function AuthShell({ mode }: { mode: "login" | "register" }) {
  const register = mode === "register";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: "include" });
      const response = await fetch(`${API_URL}/api/auth/${register ? "register" : "login"}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message ?? "We could not complete the request.");
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
      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        <section className="hidden flex-col justify-between p-12 lg:flex">
          <BrandMark />
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-1.5 text-xs text-cyan-200"><LockKeyhole className="size-3.5" /> Secure authorization operations</span>
            <h1 className="mt-7 text-5xl font-semibold leading-[1.02] tracking-[-.045em]">{register ? "Your authorization operation, finally in one place." : "Welcome back to calmer operations."}</h1>
            <div className="mt-9 space-y-4 text-sm text-slate-400">
              {["Tenant-isolated healthcare workspace", "Salesforce-connected ownership and status", "Accountable, human-reviewed workflows"].map(item => <p key={item} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-cyan-300/10"><Check className="size-3.5 text-cyan-300" /></span>{item}</p>)}
            </div>
          </div>
          <p className="text-xs text-slate-600">HIPAA-first architecture · Encrypted sessions · Audited access</p>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-10">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0b111a]/90 p-7 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-xl sm:p-9">
            <div className="mb-10 lg:hidden"><BrandMark /></div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-300">{register ? "Create workspace" : "Secure sign in"}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">{register ? "Start your 14-day trial" : "Continue to Authora"}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{register ? "No credit card. Set up your clinical operations workspace." : "Use your organization account or Salesforce identity."}</p>

            <a href={`${API_URL}/auth/salesforce/redirect`} className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#0b5cab] px-4 py-3.5 text-sm font-semibold transition hover:bg-[#106fc7]">
              <span className="text-base font-bold">SF</span> Continue with Salesforce
            </a>

            <div className="my-7 flex items-center gap-4"><div className="h-px flex-1 bg-white/10" /><span className="text-xs text-slate-600">or use email</span><div className="h-px flex-1 bg-white/10" /></div>

            <form onSubmit={submit} className="space-y-4">
              {register && <Field label="Organization name" name="organization_name" placeholder="Northstar Orthopedics" autoComplete="organization" />}
              {register && <Field label="Your name" name="name" placeholder="Morgan Reed" autoComplete="name" />}
              <Field label="Work email" name="email" type="email" placeholder="you@organization.com" autoComplete="email" />
              <Field label="Password" name="password" type="password" placeholder="At least 8 characters" autoComplete={register ? "new-password" : "current-password"} />
              {register && <Field label="Confirm password" name="password_confirmation" type="password" placeholder="Repeat your password" autoComplete="new-password" />}
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

function Field({ label, ...props }: { label: string; name: string; type?: string; placeholder: string; autoComplete: string }) {
  return <label className="block text-sm font-medium text-slate-300">{label}<input required {...props} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.045] px-4 py-3 text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-300/45 focus:ring-4 focus:ring-cyan-300/5" /></label>;
}
