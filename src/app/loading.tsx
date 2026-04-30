"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Loading() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center bg-gray-50 fixed z-9999 top-0 left-0 w-svw h-svh">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
