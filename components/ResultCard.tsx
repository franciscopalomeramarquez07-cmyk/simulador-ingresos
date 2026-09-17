"use client";

import { forwardRef, ReactNode } from "react";
import { motion } from "framer-motion";

interface ResultCardProps {
  index?: number;
  className?: string;
  children?: ReactNode;
}

const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(function ResultCard(
  { index = 0, className = "", children },
  ref
) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

export default ResultCard;
