import { AuthShell } from "@/components/auth-shell";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in" };
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ salesforce?: string }>;
}) {
  const { salesforce } = await searchParams;

  return <AuthShell mode="login" salesforceUnavailable={salesforce === "not-configured"} />;
}
