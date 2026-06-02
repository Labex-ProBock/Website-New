// TODO: Replace with AI chatbot integration once built — route to /api/chat and remove /quote redirect

"use client";

import { AnimatePresence, motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ChatWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-[var(--z-modal)]">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* TODO: Replace with AI chatbot integration once built */}
          <Link
            href="/quote"
            className="flex items-center gap-3 px-5 py-3 bg-[var(--color-orange)] hover:bg-[var(--color-orange-deep)] text-white font-semibold rounded-full shadow-2xl transition-all"
          >
            <MessageCircle size={20} />
            <span>Chat with us</span>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
