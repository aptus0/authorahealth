"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Circle, Database, LoaderCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { SalesforceLogo } from "@/components/salesforce-logo";
import { API_URL, apiFetch, initializeCsrf } from "@/lib/api";

type Integration = {
  configured: boolean;
  connection: null | {
    salesforce_org_id?: string;
    instance_url?: string;
    status: string;
    provisioning_status: string;
    provisioning_progress: number;
    provisioning_step?: string;
    last_error?: string;
  };
  package: { version: string; components: Array<{ type: string; name: string }> };
};

export function SalesforceIntegrationPanel() {
  const [data, setData] = useState<Integration | null>(null);
  const [busy, setBusy] = useState<"assess" | "install" | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await apiFetch("/api/salesforce");
    if (response.ok) setData(await response.json());
  }

  useEffect(() => {
    apiFetch("/api/salesforce")
      .then(async response => response.ok ? response.json() : null)
      .then(result => { if (result) setData(result); });
  }, []);

  async function action(kind: "assess" | "install") {
    setBusy(kind); setMessage("");
    try {
      await initializeCsrf();
      const response = await apiFetch(`/api/salesforce/${kind}`, { method: "POST" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message ?? "The Salesforce operation could not be completed.");
      setMessage(kind === "assess" ? "Org assessment completed." : "Provisioning validation queued.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The Salesforce operation could not be completed.");
    } finally { setBusy(null); }
  }

  const connected = Boolean(data?.connection);

  return <div className="mt-8 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
    <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex items-start justify-between"><SalesforceLogo className="h-16 w-24" /><span className={`rounded-full px-3 py-1 text-xs font-semibold ${connected ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{connected ? "Connected" : "Not connected"}</span></div>
      <h2 className="mt-7 text-2xl font-semibold">Salesforce</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">Connect with OAuth, assess supported org capabilities, and review the exact metadata Authora plans to install before deployment.</p>
      {connected ? <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600"><p><strong>Org:</strong> {data?.connection?.salesforce_org_id}</p><p className="mt-2 truncate"><strong>Instance:</strong> {data?.connection?.instance_url}</p><p className="mt-2"><strong>Status:</strong> {data?.connection?.provisioning_step ?? data?.connection?.provisioning_status}</p></div> : null}
      <div className="mt-7 flex flex-wrap gap-3">{!connected ? <a href={`${API_URL}/settings/integrations/salesforce/connect`} className="inline-flex items-center gap-2 rounded-lg bg-[#0b5cab] px-4 py-3 text-sm font-semibold text-white">Connect Salesforce <ArrowRight className="size-4" /></a> : <><button onClick={() => action("assess")} disabled={Boolean(busy)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold disabled:opacity-50">{busy === "assess" ? <LoaderCircle className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Assess org</button><button onClick={() => action("install")} disabled={Boolean(busy)} className="inline-flex items-center gap-2 rounded-lg bg-[#123448] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy === "install" ? <LoaderCircle className="size-4 animate-spin" /> : <ArrowRight className="size-4" />} Validate installation</button></>}</div>
      {message && <p role="status" className="mt-4 text-xs text-slate-600">{message}</p>}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">{["Minimum API scopes", "Encrypted server-side tokens", "Tenant-bound org identity", "Audited deployment lifecycle"].map(item => <div key={item} className="flex items-center gap-2 text-xs text-slate-600"><Check className="size-4 text-emerald-600" />{item}</div>)}</div>
    </section>
    <section className="rounded-xl border border-slate-200 bg-white p-6"><div className="flex items-center justify-between"><h2 className="font-semibold">Installation plan</h2><span className="text-xs text-slate-400">v{data?.package.version ?? "0.1.0"}</span></div><p className="mt-2 text-xs leading-5 text-slate-500">Deployment begins only after an administrator approves the package.</p><div className="mt-6 space-y-5">{[[ShieldCheck,"Authorize org"],[Database,"Assess metadata"],[Circle,"Review package"],[Circle,"Deploy and verify"]].map(([Icon,title],index) => {const I=Icon as typeof Circle; return <div key={title as string} className="flex gap-3"><span className={`grid size-8 place-items-center rounded-full ${index===0||connected?"bg-teal-50 text-teal-700":"bg-slate-100 text-slate-400"}`}><I className="size-4" /></span><div><p className="text-sm font-semibold">{title as string}</p><p className="mt-1 text-xs text-slate-400">Step {index+1} of 4</p></div></div>})}</div>{data?.package.components?.length ? <p className="mt-7 border-t border-slate-100 pt-5 text-xs text-slate-500">{data.package.components.length} versioned metadata components in this package.</p> : null}</section>
  </div>;
}
