"use client";

import { motion } from "framer-motion";

export function WhatsAppButton({ number }: { number: string }) {
  const href = `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hello Goodwill Skills Academy, I want to know more about your courses.",
  )}`;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-600/40"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" aria-hidden />
      <svg viewBox="0 0 32 32" className="relative h-7 w-7 fill-current" aria-hidden>
        <path d="M16.04 3C9.4 3 4 8.36 4 14.97c0 2.11.56 4.17 1.62 5.99L4 29l8.25-1.6a12.1 12.1 0 0 0 3.79.61C22.67 28 28 22.64 28 16.03 28 9.42 22.67 3 16.04 3Zm0 22.86c-1.2 0-2.38-.2-3.5-.6l-.25-.09-4.9.95.98-4.75-.17-.27a9.8 9.8 0 0 1-1.52-5.13c0-5.42 4.42-9.84 9.37-9.84 5.4 0 9.8 4.47 9.8 9.9 0 5.45-4.4 9.83-9.81 9.83Zm5.37-7.35c-.29-.15-1.74-.86-2-.95-.27-.1-.47-.15-.67.15-.2.29-.77.95-.94 1.15-.17.2-.35.22-.64.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.67-1.6-.91-2.2-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.2 3.03c.15.2 2.06 3.15 5 4.42.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.12.56-.08 1.74-.71 1.98-1.4.25-.68.25-1.27.17-1.4-.07-.12-.27-.2-.56-.34Z" />
      </svg>
    </motion.a>
  );
}
