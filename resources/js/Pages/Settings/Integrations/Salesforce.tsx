import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

type Connection = {
    status: string;
    instance_url?: string;
    salesforce_org_id?: string;
    connected_at?: string;
    last_synced_at?: string;
    last_error?: string;
};

export default function Salesforce({ configured, connection }: { configured: boolean; connection: Connection | null }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout header={
            <div>
                <p className="text-sm font-medium text-teal-700">Settings / Integrations</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Salesforce connection</h1>
            </div>
        }>
            <Head title="Salesforce Integration" />
            <div className="min-h-[calc(100vh-8rem)] bg-slate-50 py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    {flash.success && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{flash.success}</div>}

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-5 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0b5cab] font-bold text-white">SF</span>
                                <div>
                                    <h2 className="font-semibold text-slate-950">Salesforce Health Cloud / CRM</h2>
                                    <p className="mt-1 text-sm text-slate-500">OAuth 2.0 External Client App connection</p>
                                </div>
                            </div>
                            <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${connection?.status === 'connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                {connection?.status ?? 'Not connected'}
                            </span>
                        </div>

                        <div className="p-6">
                            {!configured && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                    Add the Salesforce External Client App consumer key and secret to the server environment before connecting.
                                </div>
                            )}

                            <div className="mt-2 grid gap-4 sm:grid-cols-3">
                                {[
                                    ['Instance', connection?.instance_url ?? '—'],
                                    ['Salesforce Org ID', connection?.salesforce_org_id ?? '—'],
                                    ['Last health check', connection?.last_synced_at ? new Date(connection.last_synced_at).toLocaleString() : 'Never'],
                                ].map(([label, value]) => (
                                    <div key={label} className="rounded-xl bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                                        <p className="mt-2 break-all text-sm font-medium text-slate-800">{value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                                {!connection && (
                                    <Link href={route('integrations.salesforce.redirect')} className={`rounded-xl px-5 py-3 text-sm font-semibold text-white ${configured ? 'bg-[#0b5cab]' : 'pointer-events-none bg-slate-300'}`}>
                                        Connect Salesforce
                                    </Link>
                                )}
                                {connection && (
                                    <>
                                        <button onClick={() => router.post(route('integrations.salesforce.test'))} className="rounded-xl bg-[#0b5cab] px-5 py-3 text-sm font-semibold text-white">Test connection</button>
                                        <button onClick={() => router.delete(route('integrations.salesforce.destroy'))} className="rounded-xl border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-700">Disconnect</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="font-semibold text-slate-950">Planned synchronization boundary</h2>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {['Accounts and patient references', 'Cases and authorization status', 'Tasks and operational ownership', 'Document references without uncontrolled PHI duplication'].map((item) => (
                                <div key={item} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600">{item}</div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
