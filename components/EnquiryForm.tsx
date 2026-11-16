"use client";

import { useActionState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { submitEnquiry, type EnquiryState } from "@/app/actions";

type Props = {
  courses: string[];
  defaultCourse?: string;
  title?: string;
  dark?: boolean;
};

export function EnquiryForm({ courses, defaultCourse, title = "Book a Free Counselling Session", dark }: Props) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, null);

  const input = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${
    dark
      ? "border-white/15 bg-white/10 text-white placeholder:text-white/50 focus:border-gold-400 focus:ring-gold-400/20"
      : "border-brand-100 bg-white text-ink placeholder:text-ink/40 focus:border-brand-400 focus:ring-brand-200/50"
  }`;

  return (
    <div className={`relative rounded-3xl p-6 sm:p-8 ${dark ? "bg-white/5 backdrop-blur-xl ring-1 ring-white/15" : "bg-white shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100"}`}>
      <h3 className={`mb-1 font-display text-2xl font-bold ${dark ? "text-white" : "text-brand-900"}`}>{title}</h3>
      <p className={`mb-6 text-sm ${dark ? "text-white/70" : "text-ink/60"}`}>
        Fill the form and our counsellor will call you within 24 hours.
      </p>

      <AnimatePresence mode="wait">
        {state?.ok ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <motion.div initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring" }}>
              <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            </motion.div>
            <p className={`mt-4 font-medium ${dark ? "text-white" : "text-brand-900"}`}>{state.message}</p>
          </motion.div>
        ) : (
          <motion.form key="form" action={action} className="space-y-4" exit={{ opacity: 0 }}>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="sr-only">Your name</span>
                <input name="name" required placeholder="Your Name *" className={input} />
              </label>
              <label className="block">
                <span className="sr-only">Phone number</span>
                <input name="phone" type="tel" required placeholder="Phone Number *" className={input} />
              </label>
            </div>
            <label className="block">
              <span className="sr-only">Email</span>
              <input name="email" type="email" placeholder="Email (optional)" className={input} />
            </label>
            <label className="block">
              <span className="sr-only">Course</span>
              <select name="course" defaultValue={defaultCourse ?? ""} className={input}>
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c} value={c} className="text-ink">
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">Message</span>
              <textarea name="message" rows={3} placeholder="Your message (optional)" className={input} />
            </label>
            {state && !state.ok && <p className="text-sm font-medium text-red-500">{state.message}</p>}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-gold-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/30 disabled:opacity-60"
            >
              {pending ? "Sending..." : <>Get Free Counselling <Send className="h-4 w-4" /></>}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
