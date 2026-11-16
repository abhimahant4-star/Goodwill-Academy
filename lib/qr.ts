import QRCode from "qrcode";
import { SITE_URL } from "./seo";

export function certificateUrl(id: string) {
  return `${SITE_URL}/certificate/${id}`;
}

/** QR code (as an SVG string) that opens the public verification page for a certificate. */
export function certificateQrSvg(id: string) {
  return QRCode.toString(certificateUrl(id), {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#2e0719", light: "#ffffff" },
  });
}
