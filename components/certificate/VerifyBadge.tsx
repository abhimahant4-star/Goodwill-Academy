"use client";

import { motion } from "framer-motion";
import { BadgeCheck, ShieldAlert } from "lucide-react";

export function VerifyBadge({ valid }: { valid: boolean }) {
  return (
    <motion.span
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
      className={`relative grid h-24 w-24 place-items-center rounded-full ${valid ? "bg-emerald-500" : "bg-red-500"} shadow-2xl`}
    >
      <motion.span
        className={`absolute inset-0 rounded-full ${valid ? "bg-emerald-400" : "bg-red-400"}`}
        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      {valid ? <BadgeCheck className="relative h-12 w-12" /> : <ShieldAlert className="relative h-12 w-12" />}
    </motion.span>
  );
}
