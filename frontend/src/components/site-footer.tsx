import Link from "next/link";
import { BrandMark } from "@/components/brand";

const groups = [
  ["Platform", [["Overview", "/#product"], ["Workflow", "/#workflow"], ["Salesforce", "/#salesforce"], ["Security", "/security"]]],
  ["Company", [["About Authora", "/company"], ["Product principles", "/company#principles"], ["Contact", "mailto:hello@authora.health"]]],
  ["Legal", [["Privacy", "/privacy"], ["Terms", "/terms"], ["Responsible AI", "/security#responsible-ai"]]],
] as const;

export function SiteFooter() {
  return <footer className="border-t border-white/[.08] bg-[#050d14] text-white"><div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-16 lg:grid-cols-[1.4fr_2fr]"><div><BrandMark /><p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">The accountable prior authorization operating system for specialty-care teams.</p><p className="mt-7 text-xs text-slate-600">Product foundation in active development. No customer outcome claims are presented without verified production evidence.</p></div><div className="grid gap-8 sm:grid-cols-3">{groups.map(([heading, links]) => <div key={heading}><p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-500">{heading}</p><div className="mt-5 space-y-3">{links.map(([label, href]) => <Link key={label} href={href} className="block text-sm text-slate-300 hover:text-white">{label}</Link>)}</div></div>)}</div></div><div className="border-t border-white/[.07]"><div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-6 py-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Authora Health, Inc.</p><p>Prior authorization, accountable.</p></div></div></footer>;
}
