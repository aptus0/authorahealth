import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand";

const groups = [
  ["Platform", [["Overview", "/#platform"], ["Workflow", "/#workflow"], ["Salesforce", "/#salesforce"], ["Security", "/security"]]],
  ["Company", [["About Authora", "/company"], ["Product principles", "/company#principles"], ["Contact", "mailto:hello@authora.health"]]],
  ["Legal", [["Privacy", "/privacy"], ["Terms", "/terms"], ["Responsible AI", "/security#responsible-ai"]]],
] as const;

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[.08] bg-[#050d14] text-white">
      <div className="footer-grid pointer-events-none absolute inset-0 opacity-35" />
      <div className="footer-sun pointer-events-none absolute bottom-[-390px] left-1/2 h-[640px] w-[min(1080px,120vw)] -translate-x-1/2 rounded-[50%_50%_0_0] border border-[#8af0e4]/25" aria-hidden="true">
        <div className="absolute inset-[8%] rounded-[50%_50%_0_0] border border-white/10" />
        <div className="absolute inset-[18%] rounded-[50%_50%_0_0] border border-white/[.07]" />
      </div>
      <div className="footer-horizon pointer-events-none absolute bottom-[248px] left-1/2 h-px w-[min(1180px,92vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#76e4df]/45 to-transparent" />

      <div className="relative mx-auto grid max-w-[1240px] gap-12 px-6 pb-52 pt-20 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">The accountable prior authorization operating system for specialty-care teams.</p>
          <Link href="/register" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-[#76e4df]/20 bg-[#76e4df]/10 px-4 py-3 text-sm font-semibold text-[#a5f3ec] backdrop-blur transition hover:border-[#76e4df]/40 hover:bg-[#76e4df]/15">
            Explore Authora <ArrowUpRight className="size-4" />
          </Link>
          <p className="mt-7 max-w-md text-xs leading-5 text-slate-600">Product foundation in active development. No customer outcome claims are presented without verified production evidence.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map(([heading, links]) => (
            <div key={heading}>
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-500">{heading}</p>
              <div className="mt-5 space-y-3">
                {links.map(([label, href]) => <Link key={label} href={href} className="block text-sm text-slate-300 transition hover:translate-x-1 hover:text-[#8ce9df]">{label}</Link>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative border-t border-white/[.07] bg-[#050d14]/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-6 py-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Authora Health, Inc.</p><p>Prior authorization, accountable.</p></div>
      </div>
    </footer>
  );
}
