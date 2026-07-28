import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-white" aria-label="Authora Health home">
      <span className="authora-mark" aria-hidden="true">
        <i className="authora-mark-left" />
        <i className="authora-mark-right" />
        <i className="authora-mark-bridge" />
      </span>
      {!compact && <span>Authora <span className="text-cyan-300">Health</span></span>}
    </Link>
  );
}
