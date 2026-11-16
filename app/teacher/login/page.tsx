import type { Metadata } from "next";
import { TeacherLoginForm } from "./TeacherLoginForm";

export const metadata: Metadata = { title: "Teacher Login", robots: { index: false, follow: false } };

export default function TeacherLoginPage() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-slate-950 via-brand-950 to-brand-800 px-4">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="absolute -left-20 top-10 h-96 w-96 animate-float rounded-full bg-emerald-500/20 blur-3xl" aria-hidden />
      <div className="absolute -right-20 bottom-10 h-96 w-96 animate-float rounded-full bg-gold-500/20 blur-3xl [animation-delay:3s]" aria-hidden />
      <TeacherLoginForm />
    </div>
  );
}
