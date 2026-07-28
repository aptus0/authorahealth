import { ArrowRight, CheckCircle2, type LucideIcon } from "lucide-react";

export function DashboardPlaceholder({
  eyebrow,
  title,
  description,
  icon: Icon,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  items: string[];
}) {
  return <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-teal-700">{eyebrow}</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.035em]">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p><div className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><section className="rounded-xl border border-slate-200 bg-white p-7"><span className="grid size-11 place-items-center rounded-xl bg-teal-50 text-teal-700"><Icon className="size-5" /></span><h2 className="mt-6 text-xl font-semibold">{title} foundation</h2><p className="mt-2 text-sm leading-6 text-slate-500">This workspace is ready for organization-specific configuration.</p><button className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#123448] px-4 py-2.5 text-sm font-semibold text-white">Configure {title.toLowerCase()} <ArrowRight className="size-4" /></button></section><section className="rounded-xl border border-slate-200 bg-white p-7"><p className="text-sm font-semibold">Included controls</p><div className="mt-5 space-y-4">{items.map(item => <div key={item} className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 className="size-4 text-emerald-600" />{item}</div>)}</div></section></div></div>;
}
