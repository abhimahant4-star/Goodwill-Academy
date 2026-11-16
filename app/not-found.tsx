import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-950 to-brand-700 px-4 text-center text-white">
      <div>
        <p className="font-display text-8xl font-bold text-gold-400">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-white/70">The page you are looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-gold-500 px-6 py-3 font-semibold text-brand-950">Go Home</Link>
          <Link href="/courses" className="rounded-full border border-white/30 px-6 py-3 font-semibold">View Courses</Link>
        </div>
      </div>
    </div>
  );
}
