/**
 * Aadhaar helpers. The full number is kept only on the student record (admin-only);
 * certificates store and print the last 4 digits, as UIDAI requires for masked Aadhaar.
 */

// Verhoeff checksum tables — Aadhaar's last digit is a Verhoeff check digit.
const D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

/** Strips spaces/dashes; returns the 12 digits or "" */
export function cleanAadhaar(input: string) {
  return input.replace(/[\s-]/g, "");
}

export function isValidAadhaar(input: string) {
  const n = cleanAadhaar(input);
  if (!/^[2-9]\d{11}$/.test(n)) return false;
  let c = 0;
  n.split("")
    .reverse()
    .forEach((digit, i) => {
      c = D[c][P[i % 8][Number(digit)]];
    });
  return c === 0;
}

/** "XXXX XXXX 1234" from either a full number or the last 4 digits */
export function maskAadhaar(numberOrLast4: string) {
  const last4 = cleanAadhaar(numberOrLast4).slice(-4);
  return last4.length === 4 ? `XXXX XXXX ${last4}` : "";
}

/** "1234 5678 9012" for display in admin forms */
export function formatAadhaar(input: string) {
  return cleanAadhaar(input).replace(/(\d{4})(?=\d)/g, "$1 ");
}
