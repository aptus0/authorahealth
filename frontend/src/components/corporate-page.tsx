import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";

export function CorporatePage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#071019] text-white"><header className="border-b border-white/[.07]"><div className="mx-auto flex h-20 max-w-[1120px] items-center justify-between px-6"><BrandMark /><Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="size-4" /> Back to platform</Link></div></header><section className="mx-auto max-w-[1120px] px-6 pb-20 pt-20"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#76e4df]">{eyebrow}</p><h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-.05em] sm:text-6xl">{title}</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-slate-400">{intro}</p><div className="mt-16 grid gap-5 md:grid-cols-2">{children}</div></section><SiteFooter /></main>;
}
