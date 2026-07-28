import { ShieldCheck } from "lucide-react";
import { DashboardPlaceholder } from "@/components/dashboard-placeholder";

export default function SecurityPage() {
  return <DashboardPlaceholder eyebrow="Trust center" title="Security" description="Review access controls, active connections, and auditable workspace events." icon={ShieldCheck} items={["Encrypted session enforcement", "Salesforce connection health", "Tenant-bound audit events", "Sensitive-data handling controls"]} />;
}
