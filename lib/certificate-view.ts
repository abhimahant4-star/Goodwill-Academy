import { getCertificate, getSettings } from "./db";
import { certificateQrSvg, certificateUrl } from "./qr";

/** Everything needed to render a certificate sheet, or null if the ID doesn't exist. */
export async function getCertificateView(id: string) {
  const cert = await getCertificate(decodeURIComponent(id));
  if (!cert) return null;
  const [settings, qrSvg] = await Promise.all([getSettings(), certificateQrSvg(cert.id)]);
  return { cert, settings, qrSvg, verifyUrl: certificateUrl(cert.id) };
}
