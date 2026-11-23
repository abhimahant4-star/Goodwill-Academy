"use server";

import { saveMedia } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import type { MediaKind } from "@/lib/types";

const MAX_BYTES = 1024 * 1024; // images are compressed in the browser first, so 1 MB is plenty
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const KINDS = new Set<MediaKind>(["photo", "signature", "stamp", "cover"]);

/** Stores an image sent as a data URL and returns its id. Admin only. */
export async function uploadMediaAction(kind: MediaKind, dataUrl: string): Promise<{ id?: string; error?: string }> {
  await requireAdmin();
  if (!KINDS.has(kind)) return { error: "Unknown image type." };

  const match = /^data:(image\/[a-z]+);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match || !ALLOWED.has(match[1])) return { error: "Please choose a JPG, PNG or WebP image." };

  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length > MAX_BYTES) return { error: "Image is too large. Please use a smaller photo." };

  return { id: await saveMedia(kind, match[1], bytes) };
}
