/**
 * Digital version of the academy's rectangular rubber stamp (violet ink, three lines),
 * with a light ink texture so it looks stamped rather than typed.
 */
type Props = { lines: [string, string, string]; id: string; className?: string };

const INK = "#3f3a9e";

export function Stamp({ lines, id, className }: Props) {
  const filter = `${id}-ink`;
  return (
    <svg viewBox="0 0 360 150" className={className} aria-label={lines.filter(Boolean).join(", ")} role="img">
      <defs>
        <filter id={filter} x="-5%" y="-5%" width="110%" height="110%">
          {/* Slightly rough edges */}
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="rough" />
          {/* Uneven ink coverage */}
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="3" result="blotch" />
          <feColorMatrix in="blotch" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.5" result="cover" />
          <feComposite in="rough" in2="cover" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${filter})`} fill={INK} style={{ fontFamily: "'Rockwell', 'Georgia', 'Times New Roman', serif" }}>
        <rect x="6" y="6" width="348" height="138" rx="10" fill="none" stroke={INK} strokeWidth="3" />
        <text x="180" y="50" textAnchor="middle" fontSize="31" fontWeight="700" textLength="316" lengthAdjust="spacingAndGlyphs">
          {lines[0]}
        </text>
        <text x="180" y="92" textAnchor="middle" fontSize="29" fontWeight="700">
          {lines[1]}
        </text>
        <text x="180" y="132" textAnchor="middle" fontSize="31" fontWeight="700">
          {lines[2]}
        </text>
      </g>
    </svg>
  );
}
