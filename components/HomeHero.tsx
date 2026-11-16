"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, BadgeCheck, Monitor, Palette, Scissors, Sparkles, Star } from "lucide-react";
import { SplitHeading } from "./motion";

const chips = [
  { icon: Sparkles, label: "Bridal Makeup", className: "left-0 top-6", delay: 0.6 },
  { icon: Palette, label: "Fashion Designing", className: "right-0 top-24", delay: 0.8 },
  { icon: Scissors, label: "Hair & Sewing", className: "-left-4 bottom-28", delay: 1 },
  { icon: Monitor, label: "Tally & Excel", className: "right-2 bottom-8", delay: 1.2 },
];

export function HomeHero() {
  return (
    <section className="relative overflow-clip bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 pt-32 pb-24 text-white lg:pt-40 lg:pb-32">
      <div className="grain absolute inset-0" aria-hidden />
      <motion.div
        className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-brand-500/30 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="absolute -right-32 -bottom-20 h-[460px] w-[460px] rounded-full bg-gold-500/25 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-gold-300 backdrop-blur"
          >
            <Award className="h-4 w-4" /> International &amp; Salon Certified Courses
          </motion.span>

          <h1 className="font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl xl:text-7xl">
            <SplitHeading text="Best Makeup, Fashion Designing &" />
            <span className="text-gradient">Computer Academy</span>
            <SplitHeading text=" in Tarn Taran" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/75"
          >
            Learn professional makeup, hair, skin &amp; nail art, fashion designing, sewing and computer courses at
            Goodwill Skills Academy — with practical training and an International Certificate that opens doors to your career.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              href="/courses"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-7 py-4 font-semibold text-brand-950 shadow-xl shadow-gold-500/30 transition hover:shadow-gold-500/50"
            >
              Explore Courses <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Free Counselling
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {["bg-rose-400", "bg-amber-400", "bg-violet-400", "bg-sky-400"].map((c, i) => (
                <span key={c} className={`grid h-10 w-10 place-items-center rounded-full ${c} text-sm font-bold ring-2 ring-brand-900`}>
                  {["P", "S", "K", "A"][i]}
                </span>
              ))}
            </div>
            <div>
              <div className="flex text-gold-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-white/70">Trusted by students across Tarn Taran, Amritsar &amp; Patti</p>
            </div>
          </motion.div>
        </div>

        <div className="relative mx-auto hidden h-[520px] w-full max-w-lg lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-10 overflow-hidden rounded-[3rem] bg-gradient-to-br from-brand-500 via-brand-600 to-gold-500 shadow-2xl"
          >
            <div className="grain absolute inset-0" />
            <motion.div
              className="absolute inset-0 grid place-items-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <div className="h-[140%] w-[140%] rounded-full border border-dashed border-white/20" />
            </motion.div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
              <BadgeCheck className="h-20 w-20 text-white drop-shadow-lg" />
              <p className="mt-6 font-display text-3xl font-bold">Certified Skills.</p>
              <p className="font-display text-3xl font-bold text-gold-300">Real Careers.</p>
              <p className="mt-4 text-sm text-white/80">International Certificate · Salon Certificate · Practical Training</p>
            </div>
          </motion.div>

          {chips.map(({ icon: Icon, label, className, delay }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
              transition={{
                opacity: { delay },
                scale: { delay, type: "spring" },
                y: { delay: delay + 0.5, duration: 4 + delay, repeat: Infinity, ease: "easeInOut" },
              }}
              className={`absolute ${className} flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-brand-950 shadow-2xl`}
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
