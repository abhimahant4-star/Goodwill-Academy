"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Lock } from "lucide-react";
import { login } from "../actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <motion.form
      action={action}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-sm rounded-3xl bg-white/10 p-8 text-white shadow-2xl ring-1 ring-white/20 backdrop-blur-xl"
    >
      <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-gold-500">
        <GraduationCap className="h-7 w-7" />
      </span>
      <h1 className="text-center font-display text-2xl font-bold">Goodwill Admin</h1>
      <p className="mb-6 text-center text-sm text-white/60">Sign in to manage your website</p>
      <label className="relative block">
        <span className="sr-only">Password</span>
        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
        <input
          name="password"
          type="password"
          required
          autoFocus
          placeholder="Admin password"
          className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-white/40 focus:border-gold-400"
        />
      </label>
      {error && (
        <motion.p initial={{ x: -8 }} animate={{ x: [8, -6, 4, 0] }} className="mt-3 text-sm text-red-300">
          {error}
        </motion.p>
      )}
      <button
        disabled={pending}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 py-3 font-semibold text-brand-950 transition hover:brightness-105 disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
      <p className="mt-5 text-center text-sm text-white/60">
        Are you a teacher?{" "}
        <a href="/teacher/login" className="font-semibold text-gold-300 hover:underline">
          Teacher login
        </a>
      </p>
    </motion.form>
  );
}
