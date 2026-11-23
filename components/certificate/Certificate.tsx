import { GraduationCap } from "lucide-react";
import type { Certificate as Cert, Settings } from "@/lib/types";
import { formatDate } from "@/lib/attendance";
import { mediaUrl } from "@/lib/media";
import { maskAadhaar } from "@/lib/aadhaar";
import { Stamp } from "./Stamp";

/** A4 landscape at 96dpi. The sheet is always rendered at this size and scaled on screen. */
export const CERT_W = 1122;
export const CERT_H = 793;

const GOLD = "#c9962f";
const MAROON = "#4f1231";

function Corner({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 120 120" className={`absolute h-[104px] w-[104px] ${className}`} aria-hidden>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2d48c" />
          <stop offset="1" stopColor="#b5822a" />
        </linearGradient>
      </defs>
      <path d="M4 116 V30 Q4 4 30 4 H116" fill="none" stroke="url(#cg)" strokeWidth="3" />
      <path d="M16 116 V40 Q16 16 40 16 H116" fill="none" stroke="url(#cg)" strokeWidth="1.2" />
      <path d="M28 70 Q28 28 70 28" fill="none" stroke={MAROON} strokeWidth="1.2" opacity=".5" />
      <path d="M26 26 l10 -6 l-4 10 z" fill="url(#cg)" />
      <circle cx="30" cy="30" r="6" fill={MAROON} />
      <circle cx="30" cy="30" r="2.5" fill="url(#cg)" />
      <path d="M44 16 q8 -10 16 0 q-8 10 -16 0z M16 44 q-10 8 0 16 q10 -8 0 -16z" fill="url(#cg)" />
    </svg>
  );
}

export function Seal({ size = 132 }: { size?: number }) {
  const points = Array.from({ length: 48 }, (_, i) => {
    const r = i % 2 === 0 ? 50 : 45;
    const a = (Math.PI * 2 * i) / 48;
    return `${60 + r * Math.cos(a)},${60 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden>
      <defs>
        <radialGradient id="sealGold" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fbe7b0" />
          <stop offset=".55" stopColor="#d9a645" />
          <stop offset="1" stopColor="#9c6c1c" />
        </radialGradient>
        <path id="sealText" d="M60,60 m-31,0 a31,31 0 1,1 62,0 a31,31 0 1,1 -62,0" />
      </defs>
      <polygon points={points} fill="url(#sealGold)" />
      <circle cx="60" cy="60" r="42" fill={MAROON} />
      <circle cx="60" cy="60" r="39" fill="none" stroke="#e8bd5c" strokeWidth="1" />
      <circle cx="60" cy="60" r="23" fill="none" stroke="#e8bd5c" strokeWidth=".8" strokeDasharray="2 2" />
      <text fill="#f2d48c" fontSize="6.1" fontWeight="700" letterSpacing="0.9" fontFamily="var(--font-poppins), sans-serif">
        <textPath href="#sealText" startOffset="0">GOODWILL SKILLS ACADEMY ★ TARN TARAN ★</textPath>
      </text>
      <text x="60" y="58" textAnchor="middle" fill="#f2d48c" fontSize="13" fontWeight="700" fontFamily="var(--font-playfair), serif">
        GSA
      </text>
      <text x="60" y="69" textAnchor="middle" fill="#f2d48c" fontSize="5.5" letterSpacing="1" fontFamily="var(--font-poppins), sans-serif">
        CERTIFIED
      </text>
    </svg>
  );
}

function Signature({ name, title, imageId, children }: { name: string; title: string; imageId?: string; children?: React.ReactNode }) {
  return (
    <div className="relative w-[210px] text-center">
      {children}
      <div className="relative flex h-[58px] items-end justify-center">
        {imageId && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(imageId)} alt={`Signature of ${name || title}`} className="-mb-1 max-h-[60px] max-w-[190px] object-contain" />
        )}
      </div>
      <div className="mx-auto h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${MAROON}, transparent)` }} />
      {name && <p className="mt-2 text-[14px] font-semibold text-brand-950">{name}</p>}
      <p className={name ? "text-[11px] tracking-wide text-ink/60" : "mt-2 text-[13px] font-semibold text-brand-950"}>{title}</p>
    </div>
  );
}

type Props = { cert: Cert; settings: Settings; qrSvg: string; verifyUrl: string };

export function Certificate({ cert, settings, qrSvg, verifyUrl }: Props) {
  const period =
    cert.startDate && cert.endDate ? (
      <>
        {" "}from <b>{formatDate(cert.startDate)}</b> to <b>{formatDate(cert.endDate)}</b>
      </>
    ) : null;

  return (
    <div
      className="cert-sheet relative overflow-hidden bg-[#fffdf7] font-sans text-ink"
      style={{ width: CERT_W, height: CERT_H }}
    >
      {/* Guilloche background */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="guilloche" width="46" height="46" patternUnits="userSpaceOnUse">
            <circle cx="23" cy="23" r="22" fill="none" stroke={GOLD} strokeWidth=".35" opacity=".35" />
            <circle cx="0" cy="0" r="22" fill="none" stroke={GOLD} strokeWidth=".35" opacity=".35" />
            <circle cx="46" cy="46" r="22" fill="none" stroke={GOLD} strokeWidth=".35" opacity=".35" />
          </pattern>
          <radialGradient id="vignette" cx="50%" cy="50%" r="65%">
            <stop offset=".55" stopColor="#fffdf7" stopOpacity=".92" />
            <stop offset="1" stopColor="#fffdf7" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#guilloche)" />
        <rect width="100%" height="100%" fill="url(#vignette)" />
      </svg>

      {/* Watermark */}
      <GraduationCap className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 text-brand-900 opacity-[0.035]" aria-hidden />

      {/* Borders */}
      <div className="absolute inset-[16px] border-[9px] border-brand-900" />
      <div className="absolute inset-[30px] border-[2px]" style={{ borderColor: GOLD }} />
      <div className="absolute inset-[36px] border" style={{ borderColor: "#e8bd5c88" }} />
      <Corner className="left-[26px] top-[26px]" />
      <Corner className="right-[26px] top-[26px] rotate-90" />
      <Corner className="bottom-[26px] right-[26px] rotate-180" />
      <Corner className="bottom-[26px] left-[26px] -rotate-90" />

      {/* Student photo */}
      {cert.photoId && (
        <div className="absolute right-[118px] top-[64px] z-10 rounded-[6px] bg-white p-[5px] shadow-md" style={{ boxShadow: `0 0 0 2px ${GOLD}, 0 6px 14px rgba(79,18,49,.18)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(cert.photoId)} alt={`Photo of ${cert.studentName}`} className="block h-[118px] w-[92px] rounded-[3px] object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-[56px] flex flex-col items-center text-center">
        {/* Header */}
        <div className="flex items-center gap-4">
          <span className="grid h-[58px] w-[58px] place-items-center rounded-full bg-gradient-to-br from-brand-700 to-brand-950 text-gold-300 ring-[3px] ring-gold-400 ring-offset-2 ring-offset-[#fffdf7]">
            <GraduationCap className="h-8 w-8" />
          </span>
          <div className="text-left">
            <p className="font-display text-[30px] font-bold leading-none tracking-[0.1em] text-brand-900">GOODWILL SKILLS ACADEMY</p>
            <p className="mt-1.5 text-[11.5px] font-medium tracking-[0.28em] text-gold-600 uppercase">
              Skill Development &amp; Vocational Training · {settings.city}
            </p>
          </div>
        </div>
        {settings.isoCertification && (
          <p
            className="mt-2.5 flex items-center gap-2 rounded-full border px-4 py-[3px] text-[11px] font-semibold tracking-[0.18em] text-brand-800 uppercase"
            style={{ borderColor: `${GOLD}99`, background: "#fffaf0" }}
          >
            <span style={{ color: GOLD }}>✦</span>
            An {settings.isoCertification} Certified Institute
            <span style={{ color: GOLD }}>✦</span>
          </p>
        )}

        {/* Title */}
        <div className="mt-5 flex items-center gap-5">
          <span className="h-px w-20" style={{ background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
          <h2 className="font-display text-[50px] font-bold leading-none tracking-[0.18em] text-brand-900">CERTIFICATE</h2>
          <span className="h-px w-20" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
        </div>
        <p className="font-script text-[34px] leading-tight" style={{ color: GOLD }}>of Completion</p>

        {/* Ribbon */}
        <div className="relative mt-2">
          <div className="absolute -left-4 top-1.5 h-full w-6 bg-brand-950 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,35%_50%)]" />
          <div className="absolute -right-4 top-1.5 h-full w-6 bg-brand-950 [clip-path:polygon(0_0,100%_0,65%_50%,100%_100%,0_100%)]" />
          <p className="relative bg-gradient-to-r from-brand-800 via-brand-700 to-brand-800 px-8 py-1.5 text-[12px] font-semibold tracking-[0.3em] text-gold-300 uppercase">
            {cert.certificateType}
          </p>
        </div>

        <p className="mt-7 text-[13px] tracking-[0.25em] text-ink/60 uppercase">This is to certify that</p>
        <p className="mt-1 font-script text-[64px] leading-[1.05] text-brand-900">{cert.studentName}</p>
        <div className="h-px w-[460px]" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        {(cert.guardianName || cert.aadhaarLast4) && (
          <p className="mt-2 text-[14px] text-ink/70">
            {cert.guardianName && (
              <>
                {cert.relation || "S/o / D/o"} <span className="font-semibold text-brand-950">{cert.guardianName}</span>
              </>
            )}
            {cert.guardianName && cert.aadhaarLast4 && <span className="mx-3 text-gold-500">|</span>}
            {cert.aadhaarLast4 && (
              <>
                Aadhaar No. <span className="font-mono font-semibold tracking-wider text-brand-950">{maskAadhaar(cert.aadhaarLast4)}</span>
              </>
            )}
          </p>
        )}

        <p className="mt-4 max-w-[780px] text-[16px] leading-[1.7] text-ink/80">
          has successfully completed the course <b className="text-brand-900">{cert.courseTitle}</b>
          {cert.duration && <> of <b>{cert.duration}</b> duration</>}
          {period} at Goodwill Skills Academy, {settings.city}
          {cert.grade ? (
            <>
              {" "}and has been awarded Grade <b className="text-brand-900">{cert.grade}</b>.
            </>
          ) : (
            "."
          )}
        </p>

        {/* Footer */}
        <div className="mt-auto grid w-full grid-cols-[300px_1fr_auto_1fr] items-end gap-2">
          <div className="flex items-end gap-3 text-left">
            <div className="rounded-lg bg-white p-1.5 ring-1" style={{ borderColor: GOLD, boxShadow: `0 0 0 1px ${GOLD}66` }}>
              <div className="h-[86px] w-[86px] [&_svg]:h-full [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: qrSvg }} />
            </div>
            <div className="pb-0.5 text-[10.5px] leading-[1.5] text-ink/70">
              <p className="text-[9px] font-semibold tracking-[0.18em] text-gold-600 uppercase">Certificate No.</p>
              <p className="font-mono text-[13px] font-bold tracking-wider whitespace-nowrap text-brand-950">{cert.id}</p>
              <p className="mt-1 text-[9px] font-semibold tracking-[0.18em] text-gold-600 uppercase">Date of Issue</p>
              <p className="font-semibold text-brand-950">{formatDate(cert.issueDate)}</p>
              <p className="mt-1 max-w-[190px] break-all text-[9px] text-ink/50">Scan QR or verify at {verifyUrl.replace(/^https?:\/\//, "")}</p>
            </div>
          </div>
          <div className="justify-self-center">
            <Signature
              name={cert.issuedByName || settings.signatory1Name}
              title={settings.signatory1Title}
              imageId={cert.issuedBySignatureId}
            />
          </div>
          <div className="-mb-2 justify-self-center">
            <Seal />
          </div>
          <div className="justify-self-center">
            <Signature name={settings.signatory2Name} title={settings.signatory2Title} imageId={settings.directorSignatureId || undefined}>
              {/* Academy stamp, placed over the director's signature like a real rubber stamp */}
              <div className="pointer-events-none absolute -top-[46px] left-[78px] z-10 w-[178px] -rotate-[7deg] opacity-[0.88] mix-blend-multiply">
                {settings.stampImageId ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mediaUrl(settings.stampImageId)} alt="Academy stamp" className="max-h-[96px] w-full object-contain" />
                ) : (
                  <Stamp id={`stamp-${cert.id}`} lines={[settings.stampLine1, settings.stampLine2, settings.stampLine3]} className="w-full" />
                )}
              </div>
            </Signature>
          </div>
        </div>
      </div>

      {cert.status === "revoked" && (
        <div className="absolute inset-0 grid place-items-center bg-white/40">
          <p className="-rotate-[18deg] rounded-xl border-[6px] border-red-600 px-10 py-3 font-display text-[90px] font-bold tracking-[0.2em] text-red-600/80">
            REVOKED
          </p>
        </div>
      )}
    </div>
  );
}
