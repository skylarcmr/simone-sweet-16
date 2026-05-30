export function SparkleIcon({ size = 16, color = "#d4af6b" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M8 0 L8.8 6.4 L16 8 L8.8 9.6 L8 16 L7.2 9.6 L0 8 L7.2 6.4 Z" fill={color} />
      <circle cx="3" cy="3" r="0.8" fill={color} opacity="0.5" />
      <circle cx="13" cy="13" r="0.8" fill={color} opacity="0.5" />
    </svg>
  );
}

export function HeartIcon({ size = 14, color = "#f8c8d6" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ display: "inline-block" }}>
      <path d="M7 12.5 C7 12.5 1.5 8.5 1.5 4.8 C1.5 2.8 3 1.5 4.8 1.5 C6 1.5 6.9 2.2 7 2.9 C7.1 2.2 8 1.5 9.2 1.5 C11 1.5 12.5 2.8 12.5 4.8 C12.5 8.5 7 12.5 7 12.5Z" fill={color} />
    </svg>
  );
}

export function MiniEiffelSVG({ size = 28, className = "" }: { size?: number; className?: string }) {
  const w = size * (60 / 90);
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <line x1="30" y1="1" x2="30" y2="12" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M27 18 L30 4 L33 18 Z" fill="#0a0a0a" opacity="0.85" />
      <path d="M27 18 L24 30 L36 30 L33 18 Z" fill="none" stroke="#0a0a0a" strokeWidth="1.2" strokeLinejoin="round" />
      <line x1="21" y1="30" x2="39" y2="30" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 30 L12 56 L48 56 L39 30 Z" fill="none" stroke="#0a0a0a" strokeWidth="1.2" strokeLinejoin="round" />
      <line x1="14" y1="42" x2="46" y2="42" stroke="#0a0a0a" strokeWidth="0.8" />
      <line x1="11" y1="50" x2="49" y2="50" stroke="#0a0a0a" strokeWidth="0.8" />
      <line x1="8" y1="57" x2="52" y2="57" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8 57 L0 82 L22 82 L17 57 Z" fill="none" stroke="#0a0a0a" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M43 57 L52 57 L60 82 L38 82 Z" fill="none" stroke="#0a0a0a" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M22 82 Q30 70 38 82" fill="none" stroke="#0a0a0a" strokeWidth="1.2" />
      <line x1="3" y1="70" x2="18" y2="70" stroke="#0a0a0a" strokeWidth="0.8" />
      <line x1="42" y1="70" x2="57" y2="70" stroke="#0a0a0a" strokeWidth="0.8" />
    </svg>
  );
}

export function BalloonBouquet({ className = "", size = 1 }: { className?: string; size?: number }) {
  const s = size;
  return (
    <svg width={120 * s} height={160 * s} viewBox="0 0 120 160" fill="none" className={className}>
      <ellipse cx="35" cy="50" rx="24" ry="30" fill="#f8c8d6" stroke="#e8a0b8" strokeWidth="1" />
      <ellipse cx="29" cy="40" rx="7" ry="10" fill="white" opacity="0.3" />
      <path d="M35 80 Q37 90 33 96" stroke="#c0758f" strokeWidth="1.2" fill="none" />

      <ellipse cx="62" cy="38" rx="26" ry="32" fill="#f5e6c0" stroke="#d4af6b" strokeWidth="1" />
      <ellipse cx="55" cy="28" rx="8" ry="11" fill="white" opacity="0.3" />
      <path d="M62 70 Q64 82 60 92" stroke="#b89050" strokeWidth="1.2" fill="none" />

      <ellipse cx="89" cy="53" rx="22" ry="28" fill="#fce4ec" stroke="#e8a0b8" strokeWidth="1" />
      <ellipse cx="83" cy="43" rx="6" ry="9" fill="white" opacity="0.3" />
      <path d="M89 81 Q91 90 87 97" stroke="#c0758f" strokeWidth="1.2" fill="none" />

      <path d="M33 96 Q46 130 60 148" stroke="#d4af6b" strokeWidth="1" fill="none" />
      <path d="M60 92 Q62 120 60 148" stroke="#d4af6b" strokeWidth="1" fill="none" />
      <path d="M87 97 Q74 128 60 148" stroke="#d4af6b" strokeWidth="1" fill="none" />

      <path d="M53 148 Q57 142 60 148 Q63 142 67 148" stroke="#d4af6b" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function FairyLightGarland({ width = 400, className = "" }: { width?: number; className?: string }) {
  const count = Math.max(6, Math.floor(width / 28));
  const colors = ["#f8c8d6", "#d4af6b", "#fce4ec", "#d4af6b", "#f8c8d6"];
  const lights = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const x = t * width;
    const y = 10 + 10 * Math.sin(t * Math.PI * 2);
    return { x, y, color: colors[i % colors.length] };
  });
  const d = lights.map((l, i) => `${i === 0 ? "M" : "L"} ${l.x.toFixed(1)},${l.y.toFixed(1)}`).join(" ");

  return (
    <svg width={width} height={36} viewBox={`0 0 ${width} 36`} className={className} style={{ display: "block" }}>
      <path d={d} stroke="#d4af6b" strokeWidth="0.8" fill="none" opacity="0.6" />
      {lights.map((l, i) => (
        <g key={i}>
          <line x1={l.x} y1="0" x2={l.x} y2={l.y - 3.5} stroke="#d4af6b" strokeWidth="0.6" opacity="0.5" />
          <circle cx={l.x} cy={l.y} r="3.5" fill={l.color} stroke="#c9a055" strokeWidth="0.5" />
          <circle cx={l.x - 1.2} cy={l.y - 1.2} r="1.2" fill="white" opacity="0.4" />
        </g>
      ))}
    </svg>
  );
}

export function ScatteredSparkles({ className = "" }: { className?: string }) {
  const items = [
    { x: 5, y: 8, size: 14, type: "sparkle", color: "#d4af6b" },
    { x: 20, y: 2, size: 10, type: "heart", color: "#f8c8d6" },
    { x: 40, y: 10, size: 12, type: "sparkle", color: "#f8c8d6" },
    { x: 60, y: 4, size: 8, type: "heart", color: "#d4af6b" },
    { x: 78, y: 12, size: 14, type: "sparkle", color: "#d4af6b" },
    { x: 90, y: 3, size: 10, type: "heart", color: "#f8c8d6" },
  ];
  return (
    <svg width="100" height="18" viewBox="0 0 100 18" fill="none" className={className}>
      {items.map((item, i) => {
        if (item.type === "sparkle") {
          const s = item.size / 2;
          return (
            <path key={i}
              d={`M${item.x},${item.y - s} L${item.x + 1},${item.y - 1} L${item.x + s},${item.y} L${item.x + 1},${item.y + 1} L${item.x},${item.y + s} L${item.x - 1},${item.y + 1} L${item.x - s},${item.y} L${item.x - 1},${item.y - 1} Z`}
              fill={item.color}
            />
          );
        }
        return (
          <path key={i}
            d={`M${item.x},${item.y + item.size * 0.3} C${item.x},${item.y + item.size * 0.3} ${item.x - item.size * 0.6},${item.y - item.size * 0.1} ${item.x - item.size * 0.6},${item.y - item.size * 0.3} A${item.size * 0.3},${item.size * 0.3} 0 0 1 ${item.x},${item.y} A${item.size * 0.3},${item.size * 0.3} 0 0 1 ${item.x + item.size * 0.6},${item.y - item.size * 0.3} C${item.x + item.size * 0.6},${item.y - item.size * 0.1} ${item.x},${item.y + item.size * 0.3} ${item.x},${item.y + item.size * 0.3} Z`}
            fill={item.color}
          />
        );
      })}
    </svg>
  );
}

export function MockQRCode({ size = 180, color = "#0a0a0a" }: { size?: number; color?: string }) {
  const qr = [
    [1,1,1,1,1,1,1,0,1,1,0,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0],
    [1,0,1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,0,0,1],
    [0,1,0,0,1,0,0,1,0,1,0,1,0,0,1,0,0,1,1,0,0],
    [1,1,0,1,0,1,0,0,1,0,1,0,1,1,0,1,0,0,1,1,0],
    [0,0,1,0,0,1,0,1,0,1,0,1,0,1,1,0,1,0,0,1,0],
    [1,0,0,1,0,0,1,0,1,0,1,0,1,0,0,1,0,1,1,0,1],
    [0,0,0,0,0,0,0,1,1,1,0,1,0,1,1,0,1,0,1,0,1],
    [1,1,1,1,1,1,1,0,0,0,1,0,1,0,0,1,0,0,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0],
  ];
  const n = 21;
  const cell = size / n;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" />
      {qr.flatMap((row, r) =>
        row.map((val, c) =>
          val === 1 ? (
            <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell + 0.3} height={cell + 0.3} fill={color} />
          ) : null
        )
      )}
    </svg>
  );
}

export function RibbonBannerSVG({ width = 340, className = "" }: { width?: number; className?: string }) {
  const h = 56;
  const notch = 14;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} fill="none" className={className}>
      <path
        d={`M0,0 L${width - notch},0 L${width},${h / 2} L${width - notch},${h} L0,${h} L${notch},${h / 2} Z`}
        fill="#fce4ec"
        stroke="#f8c8d6"
        strokeWidth="1.5"
      />
      <path
        d={`M4,4 L${width - notch - 2},4 L${width - 4},${h / 2} L${width - notch - 2},${h - 4} L4,${h - 4} L${notch + 2},${h / 2} Z`}
        fill="none"
        stroke="#f8c8d6"
        strokeWidth="0.8"
        opacity="0.6"
      />
    </svg>
  );
}
