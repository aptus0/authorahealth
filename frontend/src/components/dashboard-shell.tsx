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
    <main className="min-h-screen bg-white pb-20 text-[#12232f] lg:grid lg:grid-cols-[258px_1fr] lg:pb-0">
      <aside className="hidden min-h-screen border-r border-white/[.06] bg-[#08131c] p-5 text-white shadow-[18px_0_60px_rgba(8,19,28,.08)] lg:flex lg:flex-col">
        <BrandMark />
        <nav className="mt-10 space-y-1">{navigation.map(([href, label, Icon]) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${pathname === href ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/[.05] hover:text-white"}`}><Icon className="size-4" />{label}</Link>)}</nav>
        <div className="mt-auto border-t border-white/10 pt-5"><p className="truncate text-sm font-medium">{user?.name}</p><p className="mt-1 truncate text-xs text-slate-500">{user?.organization?.name}</p><button onClick={logout} className="mt-4 flex items-center gap-2 text-xs text-slate-400 hover:text-white"><LogOut className="size-4" /> Sign out</button></div>
      </aside>
      <div>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/70 bg-white/80 px-5 shadow-[0_14px_45px_rgba(35,55,65,.05)] backdrop-blur-xl sm:px-8">
          <div className="lg:hidden"><BrandMark compact /></div><p className="hidden text-sm text-slate-500 sm:block">{user?.organization?.name ?? "Authora workspace"}</p>
          <div className="flex items-center gap-3"><button aria-label="Notifications" className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm"><Bell className="size-4" /></button><Link href="/dashboard/settings" aria-label="Profile settings" className="grid size-9 place-items-center rounded-xl bg-[#173748] text-xs font-semibold text-white shadow-[0_8px_22px_rgba(23,55,72,.2)]">{user?.name?.split(" ").map(x => x[0]).slice(0,2).join("")}</Link></div>
        </header>
        <div className="mx-auto max-w-[1440px] p-5 sm:p-8">{children}</div>
      </div>
      <nav className="fixed inset-x-4 bottom-4 z-40 grid grid-cols-4 rounded-2xl border border-white/60 bg-[#0b1d26]/95 p-2 text-white shadow-[0_22px_60px_rgba(8,19,28,.3)] backdrop-blur-xl lg:hidden">
        {navigation.slice(0, 3).map(([href, label, Icon]) => <Link key={href} href={href} className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[9px] ${pathname === href ? "bg-white/10 text-[#76e4df]" : "text-slate-400"}`}><Icon className="size-4" />{label}</Link>)}
        <Link href="/dashboard/settings" className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[9px] ${pathname === "/dashboard/settings" ? "bg-white/10 text-[#76e4df]" : "text-slate-400"}`}><Settings className="size-4" />Settings</Link>
      </nav>
    </main>
  );
}
