import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

type DashboardProps = {
    metrics: { open: number; dueToday: number; approved: number; revenueAtRisk: number };
    cases: Array<{ id: string; number: string; patient: string; service: string; payer: string; status: string; due: string | null }>;
};

export default function Dashboard({ metrics: data, cases }: DashboardProps) {
    const metrics = [
        { label: 'Open cases', value: String(data.open), note: `${data.dueToday} due today` },
        { label: 'Approved cases', value: String(data.approved), note: 'Current workspace' },
        { label: 'Workflow health', value: data.open ? 'Active' : 'Ready', note: 'Tenant-isolated operations' },
        { label: 'Revenue at risk', value: `$${Math.round(data.revenueAtRisk).toLocaleString()}`, note: 'Documentation and denials' },
    ];

    const queue = cases.map((item) => [item.number, item.patient, item.service, item.payer, item.status.replaceAll('_', ' '), item.due ?? 'Not set']);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-sm font-medium text-teal-700">Authorization operations</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Good morning — here’s today’s work queue.</h1>
                </div>
            }
        >
            <Head title="Authorization Operations" />

            <div className="bg-slate-50 py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {metrics.map((metric) => (
                            <section key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{metric.value}</p>
                                <p className="mt-2 text-sm text-slate-500">{metric.note}</p>
                            </section>
                        ))}
                    </div>

                    <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <h2 className="font-semibold text-slate-950">Priority queue</h2>
                                <p className="mt-1 text-sm text-slate-500">Cases requiring attention, ordered by service date and risk.</p>
                            </div>
                            <button className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700">
                                New authorization
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                    <tr>{['Case', 'Patient', 'Service', 'Payer', 'Status', 'Due'].map((label) => <th key={label} className="px-6 py-3 font-semibold">{label}</th>)}</tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {queue.map((row) => (
                                        <tr key={row[0]} className="hover:bg-slate-50">
                                            {row.map((cell, index) => (
                                                <td key={cell} className={`whitespace-nowrap px-6 py-4 ${index === 0 ? 'font-semibold text-teal-700' : 'text-slate-700'}`}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                    {!queue.length && (
                                        <tr><td colSpan={6} className="px-6 py-14 text-center text-slate-500">No authorization cases yet. Your secure workspace is ready for the first intake.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
