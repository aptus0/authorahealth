import { Users } from "lucide-react";
import { DashboardPlaceholder } from "@/components/dashboard-placeholder";

export default function TeamPage() {
  return <DashboardPlaceholder eyebrow="Organization" title="Team" description="Manage who can access the workspace and what actions they can perform." icon={Users} items={["Administrator, reviewer, and operator roles", "Organization-scoped invitations", "Access status and activity history", "Least-privilege permission model"]} />;
}
