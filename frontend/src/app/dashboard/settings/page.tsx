"use client";

import { FormEvent, useEffect, useState } from "react";
import { BrainCircuit, Building2, Check, KeyRound, LoaderCircle, LockKeyhole, Save, UserRound } from "lucide-react";
import { apiFetch, initializeCsrf } from "@/lib/api";

type SettingsData = {
  profile: { name: string; email: string; role: string };
  organization: { name: string; timezone: string | null; plan?: string; status?: string };
  ai: { configured: boolean; model: string; status: string; key_hint?: string; last_validated_at?: string; last_error?: string };
};

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const response = await apiFetch("/api/settings");
    if (response.ok) setData(await response.json());
  }
  useEffect(() => {
    apiFetch("/api/settings")
      .then(async response => response.ok ? response.json() : null)
      .then(result => { if (result) setData(result); });
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>, path: string, kind: string) {
    event.preventDefault(); setBusy(kind); setMessage("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await initializeCsrf();
      const response = await apiFetch(path, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message ?? "Settings could not be saved.");
      setMessage(body.message); await load();
      if (kind !== "profile") event.currentTarget.reset();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Settings could not be saved."); }
    finally { setBusy(""); }
  }

  if (!data) return <div className="grid min-h-[60vh] place-items-center"><LoaderCircle className="size-6 animate-spin text-teal-700" /></div>;

  return <div>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-teal-700">Workspace administration</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Settings & profile</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Manage your identity, organization security, and tenant-owned AI provider credentials.</p></div><span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">{data.profile.role.replaceAll("_"," ")}</span></div>
    {message && <p role="status" className="mt-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">{message}</p>}

    <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
      <div className="space-y-6">
        <SettingsCard icon={UserRound} title="Profile and organization" description="Used across your Authora workspace and audit trail.">
          <form onSubmit={event => submit(event, "/api/settings/profile", "profile")} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="name" defaultValue={data.profile.name} />
            <Field label="Work email" name="email" type="email" defaultValue={data.profile.email} />
            <Field label="Organization" name="organization_name" defaultValue={data.organization.name} />
            <label className="text-sm font-medium text-slate-700">Timezone<select name="timezone" defaultValue={data.organization.timezone ?? "America/New_York"} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-teal-500"><option>America/New_York</option><option>America/Chicago</option><option>America/Denver</option><option>America/Los_Angeles</option><option>Europe/Istanbul</option><option>UTC</option></select></label>
            <button disabled={busy === "profile"} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123448] px-4 py-3 text-sm font-semibold text-white sm:col-span-2 sm:justify-self-start"><Save className="size-4" />{busy === "profile" ? "Saving…" : "Save profile"}</button>
          </form>
        </SettingsCard>

        <SettingsCard icon={LockKeyhole} title="Password and access" description="Use a unique password for your Authora account.">
          <form onSubmit={event => submit(event, "/api/settings/password", "password")} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Current password" name="current_password" type="password" />
            <span className="hidden sm:block" />
            <Field label="New password" name="password" type="password" />
            <Field label="Confirm new password" name="password_confirmation" type="password" />
            <button disabled={busy === "password"} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold sm:col-span-2 sm:justify-self-start"><KeyRound className="size-4" />{busy === "password" ? "Updating…" : "Update password"}</button>
          </form>
        </SettingsCard>
      </div>

      <div className="space-y-6">
        <SettingsCard icon={BrainCircuit} title="Authora Intelligence" description="Your API key is encrypted at rest and never returned to the browser.">
          <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"><div><p className="text-xs font-semibold">OpenAI · gpt-5.6</p><p className="mt-1 text-xs text-slate-400">{data.ai.configured ? data.ai.key_hint : "No API key configured"}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${data.ai.configured ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{data.ai.status.replaceAll("_"," ")}</span></div>
          <form onSubmit={event => submit(event, "/api/settings/ai", "ai")} className="mt-5 space-y-4">
            <Field label={data.ai.configured ? "Replace API key" : "OpenAI API key"} name="api_key" type="password" placeholder="sk-…" />
            <button disabled={busy === "ai"} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#123448] px-4 py-3 text-sm font-semibold text-white"><Save className="size-4" />{busy === "ai" ? "Encrypting…" : "Encrypt and save key"}</button>
          </form>
          <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">{["Patient identity is excluded from readiness prompts", "Responses API storage is disabled", "AI output remains advisory and human-reviewed"].map(item => <p key={item} className="flex gap-2 text-xs leading-5 text-slate-500"><Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />{item}</p>)}</div>
        </SettingsCard>

        <SettingsCard icon={Building2} title="Workspace plan" description="Current subscription and tenant boundary.">
          <div className="mt-5 grid grid-cols-2 gap-3"><Info label="Plan" value={data.organization.plan ?? "Trial"} /><Info label="Status" value={data.organization.status ?? "Active"} /><Info label="Tenant" value="Isolated" /><Info label="Encryption" value="Enabled" /></div>
        </SettingsCard>
      </div>
    </div>
  </div>;
}

function SettingsCard({ icon: Icon, title, description, children }: { icon: typeof UserRound; title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(35,55,65,.05)] sm:p-7"><div className="flex items-start gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700"><Icon className="size-5" /></span><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div></div>{children}</section>;
}
function Field({ label, name, type = "text", defaultValue, placeholder }: { label: string; name: string; type?: string; defaultValue?: string; placeholder?: string }) {
  return <label className="text-sm font-medium text-slate-700">{label}<input required name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5" /></label>;
}
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold capitalize">{value}</p></div>; }
