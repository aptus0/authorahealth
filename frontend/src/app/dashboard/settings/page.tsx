import { Settings } from "lucide-react";
import { DashboardPlaceholder } from "@/components/dashboard-placeholder";

export default function SettingsPage() {
  return <DashboardPlaceholder eyebrow="Administration" title="Settings" description="Configure organization details, authorization defaults, and workspace preferences." icon={Settings} items={["Organization profile and locations", "Authorization workflow defaults", "Notification preferences", "Subscription and usage controls"]} />;
}
