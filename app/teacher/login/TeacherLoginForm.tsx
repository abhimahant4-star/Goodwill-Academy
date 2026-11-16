"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Lock, User } from "lucide-react";
import { teacherLogin } from "../actions";

const input =
  "w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-white/40 focus:border-emerald-400";

export function TeacherLoginForm() {
  const [error, action, pending] = useActionState(teacherLogin, null);
  return (
    <motion.form
      action={action}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-sm rounded-3xl bg-white/10 p-8 text-white shadow-2xl ring-1 ring-white/20 backdrop-blur-xl"
    >
      <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
        <ClipboardCheck className="h-7 w-7" />
      </span>
      <h1 className="text-center font-display text-2xl font-bold">Teacher Login</h1>
      <p className="mb-6 text-center text-sm text-white/60">Goodwill Skills Academy · Attendance</p>
      <div className="space-y-3">
        <label className="relative block">
          <span className="sr-only">Username</span>
          <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          <input name="username" required autoFocus autoComplete="username" autoCapitalize="none" placeholder="Username" className={input} />
        </label>
        <label className="relative block">
          <span className="sr-only">Password</span>
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          <input name="password" type="password" required autoComplete="current-password" placeholder="Password" className={input} />
        </label>
      </div>
      {error && (
        <motion.p initial={{ x: -8 }} animate={{ x: [8, -6, 4, 0] }} className="mt-3 text-sm text-red-300" role="alert">
          {error}
        </motion.p>
      )}
      <button
        disabled={pending}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 py-3 font-semibold text-slate-950 transition hover:brightness-105 disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
      <p className="mt-5 text-center text-xs text-white/50">
        Forgot your password? Ask the academy admin to reset it.
      </p>
    </motion.form>
  );
}
