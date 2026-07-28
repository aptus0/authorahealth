import { SalesforceIntegrationPanel } from "@/components/salesforce-integration-panel";

export default function IntegrationsPage() {
  return <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-teal-700">Workspace setup</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.035em]">Integrations</h1><p className="mt-2 text-sm text-slate-500">Connect the systems that support your authorization workflow.</p><SalesforceIntegrationPanel /></div>;
}
