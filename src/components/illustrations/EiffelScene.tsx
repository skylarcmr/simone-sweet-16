// Black Eiffel silhouette, fairy lights string, baby pink ribbons & balloons, gold sparkles.
// Click anywhere to enter the booth.

export function EiffelScene({ onEnter }: { onEnter: () => void }) {
  return (
    <svg
      viewBox="0 0 720 720"
      role="img"
      aria-label="Paris night with Eiffel tower"
      className="w-full h-auto cursor-pointer select-none"
      onClick={onEnter}
    >
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8e7" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#f8c8d6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f8c8d6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b88a3a" />
          <stop offset="50%" stopColor="#e6c89a" />
          <stop offset="100%" stopColor="#b88a3a" />
        </linearGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft moon glow halo */}
      <circle cx="540" cy="180" r="160" fill="url(#moonGlow)" />
      <circle cx="540" cy="180" r="36" fill="#fff8e7" opacity="0.95" />

      {/* Gold sparkles scattered */}
      {[
        [80, 110], [620, 90], [120, 480], [640, 460],
        [200, 70], [480, 540], [60, 380], [580, 320],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`} className="twinkle" style={{ animationDelay: `${i * 0.3}s` }}>
          <path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill="#d4af6b" />
        </g>
      ))}

      {/* Fairy lights string across top */}
      <path d="M 20 80 Q 180 140, 360 100 T 700 90" fill="none" stroke="#0a0a0a" strokeWidth="1.2" />
      {[
        [60, 95, "#f8c8d6"], [130, 122, "#d4af6b"], [200, 130, "#f8c8d6"],
        [280, 120, "#fff8e7"], [360, 100, "#f8c8d6"], [440, 100, "#d4af6b"],
        [520, 96, "#f8c8d6"], [600, 90, "#fff8e7"], [670, 90, "#f8c8d6"],
      ].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <line x1="0" y1="-4" x2="0" y2="2" stroke="#0a0a0a" strokeWidth="0.8" />
          <circle r="5" fill={c as string} className="twinkle" style={{ animationDelay: `${i * 0.25}s` }} filter="url(#softGlow)" />
        </g>
      ))}

      {/* Eiffel Tower silhouette — hand-stylized */}
      <g className="float-y" transform="translate(360 0)">
        <g fill="#0a0a0a" stroke="#0a0a0a" strokeLinejoin="round">
          {/* Tip */}
          <rect x="-2" y="170" width="4" height="40" />
          <polygon points="-1,165 1,165 0,150" />
          {/* Antenna spire */}
          <rect x="-3" y="200" width="6" height="20" />
          {/* Top platform */}
          <polygon points="-10,220 10,220 14,235 -14,235" />
          {/* Upper section narrowing */}
          <polygon points="-14,235 14,235 22,330 -22,330" />
          {/* Mid platform */}
          <polygon points="-22,330 22,330 28,345 -28,345" />
          {/* Middle section */}
          <polygon points="-28,345 28,345 50,470 -50,470" />
          {/* Lower platform */}
          <polygon points="-50,470 50,470 60,490 -60,490" />
          {/* Legs (arches) */}
          <path d="M -60 490 L -100 580 L -110 580 L -110 600 L -60 600 L -60 580 Q -50 540 -25 510 L -25 490 Z" />
          <path d="M  60 490 L 100 580 L 110 580 L 110 600 L  60 600 L  60 580 Q  50 540  25 510 L  25 490 Z" />
          {/* Base shadow */}
          <ellipse cx="0" cy="610" rx="120" ry="6" opacity="0.3" />
        </g>
        {/* Latticework cross-bracing hint (gold accent) */}
        <g stroke="#d4af6b" strokeWidth="0.8" opacity="0.55">
          <line x1="-20" y1="245" x2="20" y2="320" />
          <line x1="20" y1="245" x2="-20" y2="320" />
          <line x1="-40" y1="370" x2="40" y2="450" />
          <line x1="40" y1="370" x2="-40" y2="450" />
        </g>
      </g>

      {/* Pink balloons (bouquet) bottom-left */}
      <g transform="translate(120 480)">
        {[
          [0, 0, 22, "#f8c8d6"], [-30, -10, 18, "#ffffff"],
          [25, -20, 20, "#d4af6b"], [-10, 30, 16, "#f8c8d6"],
        ].map(([x, y, r, c], i) => (
          <g key={i} className="float-y" style={{ animationDelay: `${i * 0.4}s` }}>
            <ellipse cx={x as number} cy={y as number} rx={r as number} ry={(r as number) + 2} fill={c as string} stroke="#0a0a0a" strokeWidth="1" />
            <line x1={x as number} y1={(y as number) + (r as number) + 2} x2={(x as number) + 2} y2={(y as number) + 80} stroke="#0a0a0a" strokeWidth="0.6" />
            <polygon points={`${x},${(y as number) + (r as number) + 2} ${(x as number) - 3},${(y as number) + (r as number) + 8} ${(x as number) + 3},${(y as number) + (r as number) + 8}`} fill={c as string} stroke="#0a0a0a" strokeWidth="0.6" />
          </g>
        ))}
      </g>

      {/* Pink ribbon banner with "SIMONE" */}
      <g transform="translate(360 660)">
        <path d="M -200 -20 Q -100 -32, 0 -22 T 200 -20 L 210 0 Q 100 12, 0 2 T -210 0 Z" fill="#f8c8d6" stroke="#0a0a0a" strokeWidth="1.5" />
        {/* ribbon tails */}
        <polygon points="-200,-20 -240,-30 -230,-10 -210,0" fill="#e89eb4" stroke="#0a0a0a" strokeWidth="1.2" />
        <polygon points="200,-20 240,-30 230,-10 210,0" fill="#e89eb4" stroke="#0a0a0a" strokeWidth="1.2" />
        <text x="0" y="-2" textAnchor="middle" fontFamily="Allura, cursive" fontSize="44" fill="#0a0a0a">Simone</text>
      </g>
    </svg>
  );
}
