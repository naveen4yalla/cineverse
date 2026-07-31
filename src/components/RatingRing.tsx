interface Props {
  value: number; // 0-10
  size?: number;
  stroke?: number;
}

export default function RatingRing({ value, size = 56, stroke = 4 }: Props) {
  const pct = Math.max(0, Math.min(1, value / 10));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  const color = value >= 7.5 ? '#f59e0b' : value >= 6 ? '#fb7185' : '#f43f5e';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          fill="none"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <span
        className="absolute font-bold tabular-nums"
        style={{ fontSize: size * 0.28 }}
      >
        {value.toFixed(1)}
      </span>
    </div>
  );
}
