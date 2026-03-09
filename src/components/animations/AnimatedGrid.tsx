"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.4, ease: "easeOut" as const } 
  }
};

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGrid({ children, className }: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className={cn("grid", className)}
    >
      {React.Children.map(children, (child) => (
        <motion.div 
          variants={itemVariants} 
          whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }} 
          whileTap={{ scale: 0.98 }}
          className="h-full"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
