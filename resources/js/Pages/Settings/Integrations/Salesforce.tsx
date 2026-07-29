import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Assessment = {
    capabilities?: Record<string, boolean>;
    api_usage?: { daily_remaining?: number; daily_max?: number };
    assessed_at?: string;
};

type DeploymentResult = {
    status?: string;
    done?: boolean;
    success?: boolean;
    number_components_total?: number;
    number_components_deployed?: number;
    number_component_errors?: number;
};

type Connection = {
    status: string;
    instance_url?: string;
    salesforce_org_id?: string;
    connected_at?: string;
    last_synced_at?: string;
    last_error?: string;
    provisioning_status?: string;
    provisioning_progress?: number;
    provisioning_step?: string;
    provisioned_at?: string;
    api_version?: string;
    environment?: string;
    assessment?: Assessment;
    assessed_at?: string;
    deployment_result?: DeploymentResult;
};

type PackagePlan = {
    version: string;
    components: Array<{ type: string; name: string }>;
    deployment_transport: string;
};

function csrfToken() {
    return decodeURIComponent(document.cookie.split('; ').find((row) => row.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '');
}

async function api<T>(url: string, method = 'GET', body?: unknown): Promise<T> {
    const response = await fetch(url, {
        method,
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken(),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message ?? 'Salesforce operation failed.');
    return payload;
}

const activeStatuses = ['queued', 'assessing', 'validating', 'packaging', 'deploying'];

export default function Salesforce({
    configured,
    connection: initialConnection,
    package: packagePlan,
    metadataDeploymentEnabled,
}: {
    configured: boolean;
    connection: Connection | null;
    package: PackagePlan;
    metadataDeploymentEnabled: boolean;
}) {
    const { flash } = usePage().props;
    const [connection, setConnection] = useState(initialConnection);
    const [busy, setBusy] = useState<'assess' | 'install' | null>(null);
    const [error, setError] = useState<string | null>(null);

    const refreshDeployment = async () => {
        const result = await api<{ connection: Connection }>('/api/salesforce/deployment');
        setConnection(result.connection);
    };

    useEffect(() => {
        if (!connection?.provisioning_status || !activeStatuses.includes(connection.provisioning_status)) return;
        const timer = window.setInterval(() => refreshDeployment().catch(() => undefined), 5000);
        return () => window.clearInterval(timer);
    }, [connection?.provisioning_status]);

    const run = async (operation: 'assess' | 'install') => {
        setBusy(operation);
        setError(null);
        try {
            if (operation === 'assess') {
                const result = await api<{ assessment: Assessment }>('/api/salesforce/assess', 'POST');
                setConnection((current) => current ? { ...current, assessment: result.assessment, assessed_at: result.assessment.assessed_at } : current);
            } else {
                const result = await api<{ connection: Connection }>('/api/salesforce/install', 'POST', {
                    package_version: packagePlan.version,
                    confirm: true,
                });
                setConnection(result.connection);
            }
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Salesforce operation failed.');
        } finally {
            setBusy(null);
        }
    };

    const progress = connection?.provisioning_progress ?? 0;
    const capabilities = connection?.assessment?.capabilities ?? {};
    const deployment = connection?.deployment_result;

    return (
        <AuthenticatedLayout header={
            <div>
                <p className="text-sm font-medium text-teal-700">Settings / Integrations</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Salesforce control plane</h1>
            </div>
        }>
            <Head title="Salesforce Integration" />
            <div className="min-h-[calc(100vh-8rem)] bg-slate-50 py-8">
                <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
                    {flash.success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{flash.success}</div>}
                    {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-5 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <img src="/images/salesforce-logo.jpg" alt="Salesforce" className="h-14 w-24 rounded-lg object-contain" />
                                <div>
                                    <h2 className="font-semibold text-slate-950">Salesforce Health Cloud / CRM</h2>
                                    <p className="mt-1 text-sm text-slate-500">OAuth 2.0 · REST API · Metadata API</p>
                                </div>
                            </div>
                            <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${connection?.status === 'connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                {connection?.status?.replaceAll('_', ' ') ?? 'Not connected'}
                            </span>
                        </div>

                        <div className="p-6">
                            {!configured && <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Configure the Salesforce External Client App credentials before connecting.</div>}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    ['Environment', connection?.environment ?? '—'],
                                    ['API version', connection?.api_version ?? '—'],
                                    ['Salesforce Org ID', connection?.salesforce_org_id ?? '—'],
                                    ['Last assessment', connection?.assessed_at ? new Date(connection.assessed_at).toLocaleString() : 'Never'],
                                ].map(([label, value]) => (
                                    <div key={label} className="rounded-xl bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                                        <p className="mt-2 break-all text-sm font-medium capitalize text-slate-800">{value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                                {!connection && <Link href={route('integrations.salesforce.redirect')} className={`rounded-xl px-5 py-3 text-sm font-semibold text-white ${configured ? 'bg-[#0b5cab]' : 'pointer-events-none bg-slate-300'}`}>Connect Salesforce</Link>}
                                {connection && <>
                                    <button disabled={busy !== null} onClick={() => run('assess')} className="rounded-xl bg-[#0b5cab] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy === 'assess' ? 'Assessing…' : 'Assess org'}</button>
                                    <button disabled={busy !== null || activeStatuses.includes(connection.provisioning_status ?? '')} onClick={() => run('install')} className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy === 'install' ? 'Queuing…' : `Install v${packagePlan.version}`}</button>
                                    <button onClick={() => router.post(route('integrations.salesforce.test'))} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">Test connection</button>
                                    <button onClick={() => router.delete(route('integrations.salesforce.destroy'))} className="rounded-xl border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-700">Disconnect</button>
                                </>}
                            </div>
                        </div>
                    </section>

                    {connection && <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Provisioning</p>
                                <h2 className="mt-2 font-semibold text-slate-950">{connection.provisioning_step ?? 'Ready for org assessment.'}</h2>
                            </div>
                            <span className="text-sm font-semibold text-slate-600">{progress}%</span>
                        </div>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${progress}%` }} /></div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl bg-slate-50 p-4 text-sm"><span className="text-slate-500">Status</span><p className="mt-1 font-semibold capitalize text-slate-900">{connection.provisioning_status?.replaceAll('_', ' ')}</p></div>
                            <div className="rounded-xl bg-slate-50 p-4 text-sm"><span className="text-slate-500">Metadata transport</span><p className="mt-1 font-semibold text-slate-900">{metadataDeploymentEnabled ? packagePlan.deployment_transport : 'Validation-only mode'}</p></div>
                            <div className="rounded-xl bg-slate-50 p-4 text-sm"><span className="text-slate-500">Components</span><p className="mt-1 font-semibold text-slate-900">{deployment ? `${deployment.number_components_deployed ?? 0} / ${deployment.number_components_total ?? 0}` : packagePlan.components.length}</p></div>
                        </div>
                        {connection.last_error && <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{connection.last_error}</p>}
                    </section>}

                    <div className="grid gap-6 lg:grid-cols-2">
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="font-semibold text-slate-950">Org assessment</h2>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                {Object.entries(capabilities).map(([key, enabled]) => (
                                    <div key={key} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm">
                                        <span className="capitalize text-slate-700">{key.replaceAll('_', ' ')}</span>
                                        <span className={enabled ? 'text-emerald-700' : 'text-slate-400'}>{enabled ? 'Available' : 'Not detected'}</span>
                                    </div>
                                ))}
                                {!Object.keys(capabilities).length && <p className="col-span-2 text-sm text-slate-500">Run an assessment to inventory org capabilities and API capacity.</p>}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-slate-950">Package v{packagePlan.version}</h2>
                                <span className="text-xs font-medium text-slate-500">{packagePlan.components.length} components</span>
                            </div>
                            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
                                {packagePlan.components.map((component) => (
                                    <div key={`${component.type}-${component.name}`} className="rounded-xl bg-slate-50 px-4 py-3">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{component.type}</p>
                                        <p className="mt-1 break-all text-sm text-slate-700">{component.name}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
