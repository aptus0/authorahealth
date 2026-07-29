import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

const DotField = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {[
            ['left-[8%] top-[18%]', 'delay-0'], ['left-[19%] top-[72%]', 'delay-300'],
            ['left-[72%] top-[20%]', 'delay-700'], ['left-[86%] top-[64%]', 'delay-1000'],
            ['left-[58%] top-[82%]', 'delay-500'],
        ].map(([position, delay], index) => (
            <span key={index} className={`absolute h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400/70 shadow-[0_0_20px_7px_rgba(45,212,191,.18)] ${position} ${delay}`} />
        ))}
    </div>
);

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="Accountable prior authorization operations" />
            <main className="min-h-screen overflow-hidden bg-[#f5f7f8] text-slate-950">
                <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/75 shadow-[0_14px_45px_-32px_rgba(15,23,42,.55)] backdrop-blur-2xl">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
                            <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-sm text-teal-300 shadow-lg shadow-slate-950/20">A</span>
                            <span>Authora Health</span>
                        </Link>
                        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
                            <a href="#platform" className="transition hover:text-slate-950">Platform</a>
                            <a href="#salesforce" className="transition hover:text-slate-950">Salesforce</a>
                            <a href="#security" className="transition hover:text-slate-950">Security</a>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            {auth.user ? <Link href={route('dashboard')} className="rounded-2xl bg-slate-950 px-5 py-2.5 text-white shadow-lg shadow-slate-950/15">Open workspace</Link> : <>
                                <Link href={route('login')} className="hidden px-4 py-2.5 text-slate-700 sm:block">Sign in</Link>
                                <Link href={route('register')} className="rounded-2xl bg-slate-950 px-5 py-2.5 text-white shadow-lg shadow-slate-950/15">Create workspace</Link>
                            </>}
                        </div>
                    </div>
                </nav>

                <section className="relative px-6 pb-24 pt-36 text-center sm:pt-44">
                    <DotField />
                    <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(45,212,191,.13),transparent_68%)]" />
                    <div className="relative mx-auto max-w-5xl">
                        <p className="text-sm font-semibold uppercase tracking-[.22em] text-teal-700">Prior authorization, accountable</p>
                        <h1 className="mx-auto mt-7 max-w-5xl text-5xl font-semibold leading-[.98] tracking-[-.055em] sm:text-7xl lg:text-[88px]">
                            One clear operating layer between care and approval.
                        </h1>
                        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600">
                            Authora coordinates intake, evidence readiness, payer follow-up, decisions and appeals—connected to the Salesforce environment your teams already use.
                        </p>
                        <div className="mt-9 flex flex-wrap justify-center gap-3">
                            <Link href={auth.user ? route('dashboard') : route('register')} className="rounded-2xl bg-teal-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-teal-700">{auth.user ? 'Open workspace' : 'Start with a secure workspace'}</Link>
                            <a href="#platform" className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-3.5 font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white">Explore the platform</a>
                        </div>
                    </div>

                    <div className="relative mx-auto mt-20 max-w-6xl">
                        <div className="rounded-[30px] border border-white bg-slate-900 p-2 shadow-[0_45px_110px_-50px_rgba(15,23,42,.75)]">
                            <div className="flex h-9 items-center gap-2 px-3">
                                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" />
                            </div>
                            <img src="/images/authora-product.png" alt="Authora Health authorization operations workspace" className="w-full rounded-[22px]" />
                        </div>
                    </div>
                </section>

                <section id="platform" className="bg-white px-6 py-28">
                    <div className="mx-auto max-w-7xl">
                        <p className="text-sm font-semibold uppercase tracking-[.2em] text-teal-700">The operating model</p>
                        <h2 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-.04em] sm:text-6xl">Exceptions become managed work, not invisible inbox risk.</h2>
                        <div className="mt-14 grid gap-5 md:grid-cols-3">
                            {[
                                ['01', 'Know readiness', 'See missing operational evidence and deadline risk before submission.'],
                                ['02', 'Make ownership explicit', 'Every state has an accountable user, due date and activity history.'],
                                ['03', 'Measure the outcome', 'Track cycle time, rework, denial reasons and open cases per operator.'],
                            ].map(([number, title, body]) => <article key={number} className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-7 shadow-[0_20px_55px_-45px_rgba(15,23,42,.55)]">
                                <p className="text-sm font-semibold text-teal-700">{number}</p><h3 className="mt-8 text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-slate-600">{body}</p>
                            </article>)}
                        </div>
                    </div>
                </section>

                <section id="salesforce" className="relative overflow-hidden bg-slate-950 px-6 py-28 text-white">
                    <DotField />
                    <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[.2em] text-teal-300">Salesforce-connected</p>
                            <h2 className="mt-5 text-4xl font-semibold tracking-[-.04em] sm:text-6xl">Connect once. Install with control.</h2>
                            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Authora assesses the org, presents a versioned metadata plan, deploys approved objects and workflows, then validates every component asynchronously.</p>
                        </div>
                        <div className="space-y-3">
                            {['OAuth administrator authorization', 'Org capability and API-capacity assessment', 'Versioned Custom Objects, Tabs and Lightning App', 'Draft Flow, validation rules and permission sets', 'Deployment result and audit history'].map((item, index) => <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.06] px-5 py-4 backdrop-blur">
                                <span className="text-sm font-semibold text-teal-300">0{index + 1}</span><span className="text-slate-200">{item}</span>
                            </div>)}
                        </div>
                    </div>
                </section>

                <section id="security" className="px-6 py-28">
                    <div className="mx-auto max-w-7xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-[.2em] text-teal-700">Designed for accountable automation</p>
                        <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-[-.04em] sm:text-6xl">Scoped credentials. Tenant isolation. Human approval.</h2>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">AI remains advisory. Salesforce tokens and tenant-owned AI keys are encrypted server-side and never returned to the browser.</p>
                    </div>
                </section>

                <footer className="border-t border-slate-200 bg-white px-6 py-12 shadow-[0_-20px_60px_-52px_rgba(15,23,42,.55)]">
                    <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                        <div><div className="flex items-center gap-3 font-semibold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-teal-300">A</span>Authora Health</div><p className="mt-3 text-sm text-slate-500">Accountable prior authorization operations.</p></div>
                        <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500">
                            <a href="#platform" className="hover:text-slate-950">Platform</a><a href="#salesforce" className="hover:text-slate-950">Salesforce</a><a href="#security" className="hover:text-slate-950">Security</a><Link href={route('login')} className="hover:text-slate-950">Sign in</Link>
                        </div>
                    </div>
                    <div className="mx-auto mt-10 max-w-7xl border-t border-slate-100 pt-6 text-xs text-slate-400">© 2026 Authora Health. Product capabilities and compliance status require customer-specific validation.</div>
                </footer>
            </main>
        </>
    );
}
