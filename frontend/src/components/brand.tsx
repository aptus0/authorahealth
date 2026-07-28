import Link from "next/link";

export function AuthoraSymbol({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="authora-fill" x1="6" y1="4" x2="42" y2="44">
          <stop stopColor="#B9FAF3" />
          <stop offset="1" stopColor="#50CFC9" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="46" height="46" rx="14" fill="#0D2633" stroke="#28505F" />
      <path d="M13 34.5 21.1 13h5.8L35 34.5h-5.8l-1.55-4.6h-7.4l1.75-4.8h4.05L24 18.8l-5.45 15.7H13Z" fill="url(#authora-fill)" />
      <path d="M31.2 11.7a6.4 6.4 0 0 1 5.1 5.1 6.4 6.4 0 0 1-5.1-5.1Z" fill="#8DEAE4" />
    </svg>
  );
}

export function BrandMark({ compact = false, dark = true }: { compact?: boolean; dark?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-3 font-semibold tracking-[-.02em] ${dark ? "text-white" : "text-[#102632]"}`} aria-label="Authora Health home">
      <AuthoraSymbol />
      {!compact && <span className="text-[15px]">Authora <span className="font-medium text-[#64d9d3]">Health</span></span>}
    </Link>
  );
}
