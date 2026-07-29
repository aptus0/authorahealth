import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';

type Credential = {
    provider: string;
    model: string;
    status: string;
    configured: boolean;
    last_validated_at?: string;
    last_error?: string;
    key_hint: string;
};

export default function AI({ credential, recommendedModel }: { credential: Credential | null; recommendedModel: string }) {
    const { flash } = usePage().props;
    const form = useForm({ api_key: '', model: recommendedModel });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.put(route('settings.ai.update'), { preserveScroll: true, onSuccess: () => form.reset('api_key') });
    };

    return (
        <AuthenticatedLayout header={
            <div>
                <p className="text-sm font-medium text-teal-700">Settings / Intelligence</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">AI provider control</h1>
            </div>
        }>
            <Head title="AI Provider Settings" />
            <div className="min-h-[calc(100vh-8rem)] bg-[#f5f7f9] py-10">
                <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
                    {flash.success && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800 shadow-sm">{flash.success}</div>}
                    {flash.error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800 shadow-sm">{flash.error}</div>}

                    <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_24px_70px_-32px_rgba(15,23,42,.35)] backdrop-blur-xl">
                        <div className="border-b border-slate-200/70 p-7">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-lg font-semibold text-white shadow-lg shadow-slate-950/20">AI</div>
                                    <div>
                                        <h2 className="font-semibold text-slate-950">OpenAI Responses API</h2>
                                        <p className="mt-1 text-sm text-slate-500">Tenant-owned credential · encrypted at rest · server-side only</p>
                                    </div>
                                </div>
                                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${credential?.status === 'connected' ? 'bg-emerald-100 text-emerald-800' : credential ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                                    {credential?.status ?? 'Not configured'}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={submit} className="p-7">
                            <div className="grid gap-6 md:grid-cols-[1fr_240px]">
                                <label>
                                    <span className="text-sm font-semibold text-slate-800">OpenAI project API key</span>
                                    <input type="password" autoComplete="off" value={form.data.api_key} onChange={(e) => form.setData('api_key', e.target.value)} placeholder={credential?.key_hint ?? 'sk-…'} className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3.5 shadow-inner focus:border-teal-500 focus:ring-teal-500" />
                                    {form.errors.api_key && <p className="mt-2 text-sm text-rose-600">{form.errors.api_key}</p>}
                                </label>
                                <label>
                                    <span className="text-sm font-semibold text-slate-800">Model</span>
                                    <input readOnly value={form.data.model} className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-100 px-4 py-3.5 text-slate-700" />
                                </label>
                            </div>

                            <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/70 p-5 text-sm leading-6 text-teal-950">
                                Authora sends only operational readiness metadata. Patient name, date of birth and free-text clinical notes are excluded. AI output remains advisory and requires human review.
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button disabled={form.processing} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 disabled:opacity-50">{form.processing ? 'Saving…' : credential ? 'Replace secure key' : 'Save secure key'}</button>
                                {credential && <>
                                    <button type="button" onClick={() => router.post(route('settings.ai.test'), {}, { preserveScroll: true })} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">Verify connection</button>
                                    <button type="button" onClick={() => router.delete(route('settings.ai.destroy'), { preserveScroll: true })} className="rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-700">Remove credential</button>
                                </>}
                            </div>
                        </form>
                    </section>

                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            ['Data boundary', 'Operational metadata only. No patient identity or uncontrolled clinical narrative.'],
                            ['Human control', 'Suggestions never submit, approve, deny or appeal without an accountable user.'],
                            ['Auditability', 'Provider configuration and readiness generation create tenant-scoped audit events.'],
                        ].map(([title, body]) => <section key={title} className="rounded-3xl border border-white bg-white/80 p-6 shadow-sm">
                            <h3 className="font-semibold text-slate-950">{title}</h3>
                            <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
                        </section>)}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
