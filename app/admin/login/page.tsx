import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 px-4">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="absolute -left-20 top-10 h-96 w-96 animate-float rounded-full bg-brand-500/30 blur-3xl" aria-hidden />
      <div className="absolute -right-20 bottom-10 h-96 w-96 animate-float rounded-full bg-gold-500/25 blur-3xl [animation-delay:3s]" aria-hidden />
      <LoginForm />
    </div>
  );
}
