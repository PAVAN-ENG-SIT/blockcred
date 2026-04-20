"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function GlassCard({ className, children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
