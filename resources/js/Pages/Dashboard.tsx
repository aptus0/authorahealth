import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

type DashboardProps = {
    metrics: { open: number; dueToday: number; approved: number; revenueAtRisk: number };
    cases: Array<{ id: string; number: string; patient: string; service: string; payer: string; status: string; due: string | null }>;
    integrations: { salesforce: string | null; ai: string | null };
};

export default function Dashboard({ metrics: data, cases, integrations }: DashboardProps) {
    const metrics = [
        { label: 'Open cases', value: String(data.open), note: `${data.dueToday} due today`, tone: 'from-cyan-400 to-teal-500' },
        { label: 'Approved', value: String(data.approved), note: 'Current workspace', tone: 'from-emerald-400 to-teal-500' },
        { label: 'Workflow health', value: data.open ? 'Active' : 'Ready', note: 'Tenant-isolated operations', tone: 'from-blue-400 to-cyan-500' },
        { label: 'Revenue at risk', value: `$${Math.round(data.revenueAtRisk).toLocaleString()}`, note: 'Documentation and denials', tone: 'from-amber-400 to-orange-500' },
    ];

    return (
        <AuthenticatedLayout header={
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-teal-700">Authorization operations</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Your accountable work queue.</h1>
                </div>
                <div className="flex gap-2 text-xs font-semibold">
                    <span className={`rounded-full px-3 py-1.5 ${integrations.salesforce === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>Salesforce · {integrations.salesforce?.replaceAll('_', ' ') ?? 'not connected'}</span>
                    <span className={`rounded-full px-3 py-1.5 ${integrations.ai === 'connected' ? 'bg-violet-100 text-violet-800' : 'bg-slate-100 text-slate-600'}`}>AI · {integrations.ai ?? 'not configured'}</span>
                </div>
            </div>
        }>
            <Head title="Authorization Operations" />
            <div className="min-h-[calc(100vh-8rem)] bg-[radial-gradient(circle_at_15%_0%,rgba(45,212,191,.10),transparent_32%),#f5f7f9] py-9">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <section className="relative overflow-hidden rounded-[32px] bg-slate-950 px-7 py-8 text-white shadow-[0_32px_90px_-45px_rgba(15,23,42,.8)] sm:px-9">
                        <div className="pointer-events-none absolute -right-14 -top-24 h-72 w-72 rounded-full border border-teal-300/20 shadow-[0_0_100px_rgba(45,212,191,.18)]" />
                        <div className="pointer-events-none absolute right-28 top-10 h-2 w-2 animate-pulse rounded-full bg-teal-300 shadow-[0_0_24px_8px_rgba(94,234,212,.35)]" />
                        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[.2em] text-teal-300">Today’s operating picture</p>
                                <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-.03em] sm:text-4xl">Know what is ready, what is blocked, and who owns the next move.</h2>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link href={route('integrations.salesforce.index')} className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg">Salesforce control</Link>
                                <Link href={route('settings.ai.edit')} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur">AI settings</Link>
                            </div>
                        </div>
                    </section>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {metrics.map((metric) => (
                            <section key={metric.label} className="group rounded-[26px] border border-white bg-white/85 p-5 shadow-[0_16px_45px_-34px_rgba(15,23,42,.55)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_-32px_rgba(15,23,42,.45)]">
                                <div className={`h-1.5 w-14 rounded-full bg-gradient-to-r ${metric.tone}`} />
                                <p className="mt-5 text-sm font-medium text-slate-500">{metric.label}</p>
                                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{metric.value}</p>
                                <p className="mt-2 text-sm text-slate-500">{metric.note}</p>
                            </section>
                        ))}
                    </div>

                    <section className="mt-6 overflow-hidden rounded-[28px] border border-white bg-white/90 shadow-[0_24px_70px_-42px_rgba(15,23,42,.55)] backdrop-blur">
                        <div className="flex flex-col gap-4 border-b border-slate-200/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                            <div><h2 className="font-semibold text-slate-950">Priority queue</h2><p className="mt-1 text-sm text-slate-500">Ordered by service date, readiness and operational risk.</p></div>
                            <button className="rounded-2xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-700">New authorization</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500"><tr>{['Case', 'Patient', 'Service', 'Payer', 'Status', 'Due'].map((label) => <th key={label} className="px-6 py-3 font-semibold">{label}</th>)}</tr></thead>
                                <tbody className="divide-y divide-slate-100">
                                    {cases.map((item) => <tr key={item.id} className="transition hover:bg-teal-50/40">
                                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-teal-700">{item.number}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-slate-700">{item.patient}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-slate-700">{item.service}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-slate-700">{item.payer}</td>
                                        <td className="whitespace-nowrap px-6 py-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">{item.status.replaceAll('_', ' ')}</span></td>
                                        <td className="whitespace-nowrap px-6 py-4 text-slate-700">{item.due ?? 'Not set'}</td>
                                    </tr>)}
                                    {!cases.length && <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-500">Your secure workspace is ready for its first authorization.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
