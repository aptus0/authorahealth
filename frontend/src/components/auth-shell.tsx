"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { BrandMark } from "@/components/brand";
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
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f4f7f6] px-5 py-12 text-[#10232c]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(118,228,223,.22),transparent_28%),radial-gradient(circle_at_10%_90%,rgba(65,155,243,.08),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,52,72,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(18,52,72,.035)_1px,transparent_1px)] bg-[size:58px_58px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <section className="relative w-full max-w-[460px]">
        <div className="mb-8 flex justify-center"><BrandMark dark={false} /></div>
        <div className="rounded-[30px] border border-white bg-white/92 p-7 shadow-[0_35px_100px_rgba(22,49,60,.14),0_1px_0_white_inset] backdrop-blur-2xl sm:p-10">
            <div className="mx-auto grid size-11 place-items-center rounded-2xl bg-[#e5f8f5] text-teal-700"><LockKeyhole className="size-5" /></div>
            <h1 className="mt-5 text-center text-3xl font-semibold tracking-[-.04em]">{register ? "Create your workspace" : "Welcome back"}</h1>
            <p className="mt-2 text-center text-sm leading-6 text-slate-500">{register ? "Set up your secure Authora organization." : "Sign in to your Authora workspace."}</p>

            {!register && <a href={`${API_URL}/auth/salesforce/redirect`} className="group mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-[#d8e2e7] bg-white px-4 py-3.5 text-sm font-semibold text-[#16384a] shadow-[0_10px_28px_rgba(17,54,72,.08)] transition hover:-translate-y-0.5 hover:border-[#2eaeef]/40 hover:shadow-[0_16px_36px_rgba(11,92,171,.12)]">
              <Image src="/brand/salesforce-logo.jpg" alt="Salesforce" width={82} height={46} className="h-8 w-[58px] object-cover object-center" priority /> Connect with Salesforce
            </a>}
            {salesforceUnavailable && (
              <p role="alert" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
                Salesforce sign-in is not configured yet. Add the Connected App client ID and secret to the API environment, then try again. Email sign-in remains available.
              </p>
            )}
            {!register && <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">Secure OAuth · Your Salesforce password is never shared with Authora.</p>}

            {!register && <div className="my-7 flex items-center gap-4"><div className="h-px flex-1 bg-slate-200" /><span className="text-[11px] font-medium uppercase tracking-[.12em] text-slate-400">or sign in with email</span><div className="h-px flex-1 bg-slate-200" /></div>}

            <form onSubmit={submit} className="space-y-4">
              {register && <Field label="Organization name" name="organization_name" placeholder="Northstar Orthopedics" autoComplete="organization" />}
              {register && <Field label="Your name" name="name" placeholder="Morgan Reed" autoComplete="name" />}
              <Field label="Work email" name="email" type="email" placeholder="you@organization.com" autoComplete="email" />
              <Field label="Password" name="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" autoComplete={register ? "new-password" : "current-password"} trailing={<button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="text-slate-500 hover:text-white">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>} />
              {register && <Field label="Confirm password" name="password_confirmation" type={showPassword ? "text" : "password"} placeholder="Repeat your password" autoComplete="new-password" />}
              {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
              <button disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#123448] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(18,52,72,.18)] transition hover:-translate-y-0.5 hover:bg-[#0d2938] disabled:opacity-60">
                {loading ? "Please wait…" : register ? "Create secure workspace" : "Sign in"} {!loading && <ArrowRight className="size-4 transition group-hover:translate-x-1" />}
              </button>
            </form>

            {register && <p className="mt-7 text-center text-sm text-slate-500">Already have an account?{" "}<Link href="/login" className="font-semibold text-teal-700 hover:text-teal-600">Sign in</Link></p>}
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">Encrypted session · Tenant-isolated access · Audited authentication</p>
      </section>
    </main>
  );
}

function Field({ label, trailing, ...props }: { label: string; name: string; type?: string; placeholder: string; autoComplete: string; trailing?: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<span className="mt-2 flex items-center rounded-xl border border-slate-200 bg-[#fbfcfc] pr-4 transition focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-500/5"><input required {...props} className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[#10232c] outline-none placeholder:text-slate-400" />{trailing}</span></label>;
}
