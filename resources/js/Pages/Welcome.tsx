import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="Prior authorization operations" />
            <main className="min-h-screen bg-[#f5f8f7] text-slate-950">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-3 font-semibold">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-600 text-white">A</span>
                        <span>Authora Health</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="rounded-xl bg-slate-950 px-5 py-3 text-white">Open workspace</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="px-4 py-3 text-slate-700">Sign in</Link>
                                <Link href={route('register')} className="rounded-xl bg-slate-950 px-5 py-3 text-white">Start a secure trial</Link>
                            </>
                        )}
                    </div>
                </nav>

                <section className="mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[.2em] text-teal-700">Prior authorization operations</p>
                        <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-.04em] sm:text-7xl">
                            Every authorization, ready before care.
                        </h1>
                        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
                            Authora brings intake, documentation readiness, payer follow-up, decisions, and appeals into one accountable workflow.
                        </p>
                        <div className="mt-9 flex flex-wrap gap-3">
                            <Link href={auth.user ? route('dashboard') : route('register')} className="rounded-xl bg-teal-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-teal-900/10">
                                {auth.user ? 'Open workspace' : 'Create your workspace'}
                            </Link>
                            <span className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-medium text-slate-600">HIPAA-first architecture</span>
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10">
                        <div className="rounded-2xl bg-slate-950 p-6 text-white">
                            <p className="text-sm text-slate-400">Today’s authorization readiness</p>
                            <p className="mt-3 text-4xl font-semibold">87.4%</p>
                            <div className="mt-7 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[87%] rounded-full bg-teal-400" /></div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            {[
                                ['Needs documentation', '14'],
                                ['Payer review', '38'],
                                ['Appeals due', '6'],
                                ['Revenue protected', '$184K'],
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-2xl bg-slate-50 p-5">
                                    <p className="text-2xl font-semibold">{value}</p>
                                    <p className="mt-1 text-sm text-slate-500">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
