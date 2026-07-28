import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://authora-health.test"),
  title: { default: "Authora Health", template: "%s — Authora Health" },
  description: "The prior authorization operating system for specialty care.",
  applicationName: "Authora Health",
  openGraph: {
    title: "Authora Health",
    description: "Prior authorization, accountable.",
    images: ["/brand/authora-social.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Authora Health",
    description: "Prior authorization, accountable.",
    images: ["/brand/authora-social.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
