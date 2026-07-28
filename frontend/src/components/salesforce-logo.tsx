export function SalesforceLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 132 92"
      role="img"
      aria-label="Salesforce"
      className={className}
    >
      <path
        fill="#0D9DDA"
        d="M54.7 10.1a25.7 25.7 0 0 1 20.4 10.1 30.7 30.7 0 0 1 44.2 27.5 30.6 30.6 0 0 1-30.6 30.6H35.4A25.2 25.2 0 0 1 30.7 28a25.7 25.7 0 0 1 24-17.9Z"
      />
      <text
        x="66"
        y="57"
        textAnchor="middle"
        fill="white"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="17"
        fontWeight="700"
      >
        salesforce
      </text>
    </svg>
  );
}
