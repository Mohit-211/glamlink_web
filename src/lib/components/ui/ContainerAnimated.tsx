"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export type ContainerAnimatedProps = {
  layout?: "simple" | "grid" | "flex";
  direction?: "x" | "y";
  layoutClasses?: string;
  parentComponent?: string;
  children: ReactNode;
};

export default function ContainerAnimated({ 
  layout = "simple",
  direction = "y",
  layoutClasses = "",
  parentComponent = "",
  children 
}: ContainerAnimatedProps) {
  const baseClasses = {
    simple: "w-full",
    grid: "grid gap-6",
    flex: "flex gap-6",
  };

  const directionVariants = {
    x: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    },
    y: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={directionVariants[direction]}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`${baseClasses[layout]} ${layoutClasses}`}
      data-parent={parentComponent}
    >
      {children}
    </motion.div>
  );
}