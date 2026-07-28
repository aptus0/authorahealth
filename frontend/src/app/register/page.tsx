import { AuthShell } from "@/components/auth-shell";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create workspace" };
export default function RegisterPage() { return <AuthShell mode="register" />; }
