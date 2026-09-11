export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 400 320"
      role="img"
      aria-label="Illustration of stacked job application cards"
      className="w-full max-w-md mx-auto"
    >
      <defs>
        <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#5b21b6" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* back card */}
      <g transform="rotate(-9 130 165)" filter="url(#cardShadow)">
        <rect x="40" y="105" width="180" height="120" rx="18" fill="var(--light)" />
        <rect x="40" y="105" width="180" height="14" rx="7" fill="var(--secondary)" />
        <rect x="58" y="140" width="110" height="10" rx="5" fill="var(--primary)" opacity="0.5" />
        <rect x="58" y="158" width="80" height="8" rx="4" fill="var(--primary)" opacity="0.3" />
        <rect x="58" y="196" width="58" height="16" rx="8" fill="var(--secondary)" opacity="0.25" />
      </g>

      {/* front card */}
      <g transform="rotate(7 230 175)" filter="url(#cardShadow)">
        <rect x="150" y="110" width="190" height="128" rx="18" fill="var(--primary)" />
        <rect x="172" y="136" width="120" height="12" rx="6" fill="var(--accent)" />
        <rect x="172" y="158" width="90" height="9" rx="4.5" fill="white" opacity="0.7" />
        <rect x="172" y="200" width="64" height="18" rx="9" fill="var(--yellow)" />
        <text
          x="204"
          y="213"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="var(--primary)"
        >
          Offer
        </text>
      </g>

      {/* sparkle accents */}
      <g fill="var(--accent)">
        <path d="M330 70 l5 12 12 5 -12 5 -5 12 -5 -12 -12 -5 12 -5 z" />
        <circle cx="60" cy="70" r="5" opacity="0.7" />
        <circle cx="350" cy="230" r="4" opacity="0.6" />
      </g>
    </svg>
  );
}
