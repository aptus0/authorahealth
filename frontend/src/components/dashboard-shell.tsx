"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, FileCheck2, LayoutDashboard, Link2, LogOut, Settings, ShieldCheck, Users } from "lucide-react";
import { BrandMark } from "@/components/brand";
import { apiFetch, initializeCsrf } from "@/lib/api";
import { useEffect, useState } from "react";

type User = { name: string; email: string; organization?: { name: string; subscription?: { plan: string; status: string } } };
const navigation = [
  ["/dashboard", "Overview", LayoutDashboard],
  ["/dashboard/cases", "Authorizations", FileCheck2],
  ["/dashboard/integrations", "Integrations", Link2],
  ["/dashboard/team", "Team", Users],
  ["/dashboard/security", "Security", ShieldCheck],
  ["/dashboard/settings", "Settings", Settings],
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    apiFetch("/api/auth/me").then(async response => {
      if (!response.ok) throw new Error();
      setUser((await response.json()).user);
    }).catch(() => window.location.href = "/login").finally(() => setChecking(false));
  }, []);

  async function logout() {
    await initializeCsrf();
    await apiFetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (checking) return <main className="grid min-h-screen place-items-center bg-[#071019] text-sm text-slate-400">Preparing your secure workspace…</main>;

  return (
    <main className="min-h-screen bg-[#f4f7f8] text-[#12232f] lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="hidden min-h-screen border-r border-slate-200 bg-[#08131c] p-5 text-white lg:flex lg:flex-col">
        <BrandMark />
        <nav className="mt-10 space-y-1">{navigation.map(([href, label, Icon]) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${pathname === href ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/[.05] hover:text-white"}`}><Icon className="size-4" />{label}</Link>)}</nav>
        <div className="mt-auto border-t border-white/10 pt-5"><p className="truncate text-sm font-medium">{user?.name}</p><p className="mt-1 truncate text-xs text-slate-500">{user?.organization?.name}</p><button onClick={logout} className="mt-4 flex items-center gap-2 text-xs text-slate-400 hover:text-white"><LogOut className="size-4" /> Sign out</button></div>
      </aside>
      <div>
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
          <div className="lg:hidden"><BrandMark compact /></div><p className="hidden text-sm text-slate-500 sm:block">{user?.organization?.name ?? "Authora workspace"}</p>
          <div className="flex items-center gap-3"><button aria-label="Notifications" className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-500"><Bell className="size-4" /></button><div className="grid size-9 place-items-center rounded-lg bg-[#173748] text-xs font-semibold text-white">{user?.name?.split(" ").map(x => x[0]).slice(0,2).join("")}</div></div>
        </header>
        <div className="mx-auto max-w-[1440px] p-5 sm:p-8">{children}</div>
      </div>
    </main>
  );
}
