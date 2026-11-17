/**
 * Goodwill Skills Academy logo — same artwork as public/logo.svg, rendered inline so the
 * name uses the site's own web fonts. `tone="light"` is for dark backgrounds.
 */
type Props = {
  tone?: "dark" | "light";
  /** Show the "Learn Skills · Build Career" line (hide it where the logo is very small). */
  tagline?: boolean;
  /** Unique per instance on a page, keeps the SVG gradient ids from clashing. */
  id: string;
  className?: string;
};

const TONES = {
  dark: { name: "#6f1844", sub: "#b5822a", tag: "#8a6476" },
  light: { name: "#ffffff", sub: "#e8bd5c", tag: "#e9d3dd" },
};

export function Logo({ tone = "dark", tagline = true, id, className }: Props) {
  const c = TONES[tone];
  const bg = `${id}-bg`;
  const gold = `${id}-gold`;
  const goldDark = `${id}-gold-dark`;

  return (
    <svg
      viewBox="0 0 1640 512"
      className={className}
      role="img"
      aria-label="Goodwill Skills Academy"
    >
      <defs>
        <radialGradient id={bg} cx="38%" cy="30%" r="80%">
          <stop offset="0" stopColor="#b0276c" />
          <stop offset=".55" stopColor="#7a1a4b" />
          <stop offset="1" stopColor="#3d0d26" />
        </radialGradient>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe7b0" />
          <stop offset=".45" stopColor="#e2b04e" />
          <stop offset="1" stopColor="#a8741f" />
        </linearGradient>
        <linearGradient id={goldDark} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4a03a" />
          <stop offset="1" stopColor="#8f5f17" />
        </linearGradient>
      </defs>

      {/* Badge */}
      <circle cx="256" cy="256" r="248" fill={`url(#${gold})`} />
      <circle cx="256" cy="256" r="232" fill={`url(#${bg})`} />
      <circle cx="256" cy="256" r="216" fill="none" stroke={`url(#${gold})`} strokeWidth="3" />
      <circle cx="256" cy="256" r="203" fill="none" stroke="#e8bd5c" strokeWidth="2" strokeDasharray="1 9" strokeLinecap="round" opacity=".7" />

      {/* Mortarboard */}
      <path d="M176 214 L176 262 Q256 304 336 262 L336 214 L256 248 Z" fill={`url(#${goldDark})`} />
      <path d="M256 118 L408 182 L256 246 L104 182 Z" fill={`url(#${gold})`} />
      <path d="M256 128 L388 182 L256 236 L124 182 Z" fill="none" stroke="#3d0d26" strokeWidth="2" opacity=".25" />
      <circle cx="256" cy="182" r="9" fill="#5a1236" />
      <path d="M256 182 Q330 186 386 196 L386 252" fill="none" stroke={`url(#${gold})`} strokeWidth="6" strokeLinecap="round" />
      <path d="M378 250 h16 l6 34 q-14 8 -28 0 z" fill={`url(#${gold})`} />

      {/* Open book */}
      <path d="M252 318 Q196 292 128 302 L128 392 Q196 382 252 406 Z" fill={`url(#${gold})`} />
      <path d="M260 318 Q316 292 384 302 L384 392 Q316 382 260 406 Z" fill={`url(#${gold})`} />
      <path
        d="M146 324 Q196 316 238 334 M146 346 Q196 338 238 356 M146 368 Q196 360 238 378 M366 324 Q316 316 274 334 M366 346 Q316 338 274 356 M366 368 Q316 360 274 378"
        fill="none"
        stroke="#7a1a4b"
        strokeWidth="4"
        strokeLinecap="round"
        opacity=".45"
      />

      {/* Sparkles */}
      <path d="M150 92 Q154 112 174 116 Q154 120 150 140 Q146 120 126 116 Q146 112 150 92 Z" fill="#f6dd9a" />
      <path d="M374 96 Q376 106 386 108 Q376 110 374 120 Q372 110 362 108 Q372 106 374 96 Z" fill="#f6dd9a" opacity=".8" />

      {/* Name */}
      <text
        x="572"
        y={tagline ? 262 : 292}
        textLength="1020"
        lengthAdjust="spacingAndGlyphs"
        fontSize="176"
        fontWeight="700"
        fill={c.name}
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        GOODWILL
      </text>
      <rect x="576" y={tagline ? 300 : 330} width="1012" height="4" rx="2" fill="#d4a03a" />
      <text
        x="576"
        y={tagline ? 388 : 418}
        textLength="1012"
        lengthAdjust="spacingAndGlyphs"
        fontSize="70"
        fontWeight="600"
        fill={c.sub}
        style={{ fontFamily: "var(--font-poppins), Arial, sans-serif" }}
      >
        SKILLS ACADEMY
      </text>
      {tagline && (
        <text
          x="578"
          y="460"
          textLength="1008"
          lengthAdjust="spacing"
          fontSize="36"
          fontWeight="500"
          fill={c.tag}
          style={{ fontFamily: "var(--font-poppins), Arial, sans-serif" }}
        >
          LEARN SKILLS · BUILD CAREER
        </text>
      )}
    </svg>
  );
}
