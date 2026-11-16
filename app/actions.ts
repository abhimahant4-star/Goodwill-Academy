"use server";

import { addEnquiry } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type EnquiryState = { ok: boolean; message: string } | null;

export async function submitEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  // Honeypot — real visitors never fill this hidden field.
  if (String(form.get("website") ?? "")) return { ok: true, message: "Thank you! We will contact you soon." };

  const name = String(form.get("name") ?? "").trim().slice(0, 100);
  const phone = String(form.get("phone") ?? "").trim().slice(0, 20);
  const email = String(form.get("email") ?? "").trim().slice(0, 120);
  const course = String(form.get("course") ?? "").trim().slice(0, 120);
  const message = String(form.get("message") ?? "").trim().slice(0, 1000);

  if (name.length < 2) return { ok: false, message: "Please enter your name." };
  if (!/^[+\d][\d\s-]{8,}$/.test(phone)) return { ok: false, message: "Please enter a valid phone number." };
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return { ok: false, message: "Please enter a valid email address." };

  await addEnquiry({ name, phone, email: email || undefined, course: course || undefined, message: message || undefined });
  revalidatePath("/admin", "layout");
  return { ok: true, message: `Thank you ${name}! Our counsellor will call you shortly.` };
}
