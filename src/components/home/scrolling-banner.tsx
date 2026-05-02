"use client";

import { motion } from "framer-motion";

const TEXT_ITEMS = [
  "Three Cities, One Comfort",
  "Stay Local, Feel Premium",
  "Homestay Alvira",
  "Modern Minimalist Living",
];

export function ScrollingBanner() {
  // Duplicating the array to create a seamless infinite loop
  const displayItems = [...TEXT_ITEMS, ...TEXT_ITEMS, ...TEXT_ITEMS, ...TEXT_ITEMS];

  return (
    <section className="py-20 overflow-hidden bg-background border-y border-border/30 select-none">
      <div className="relative flex whitespace-nowrap">
        <motion.div
          animate={{
            x: [0, -1035], // This value should ideally be dynamic based on content width
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35,
              ease: "linear",
            },
          }}
          className="flex items-center gap-10 pr-10"
        >
          {displayItems.map((text, idx) => (
            <div key={idx} className="flex items-center gap-10">
              <span className={`text-5xl md:text-7xl lg:text-8xl font-serif font-black tracking-tighter ${
                idx % 2 === 0 ? "text-foreground" : "text-primary/90"
              }`}>
                {text === "Homestay Alvira" ? (
                  <span className="relative">
                    {text}
                    <span className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[120%] bg-secondary/15 rounded-full blur-xl" />
                  </span>
                ) : text === "Stay Local" || text.includes("Premium") ? (
                  <span className="relative px-6 py-2">
                    {text}
                    <span className="absolute inset-0 bg-primary rounded-full -z-10 scale-110 opacity-10" />
                  </span>
                ) : (
                  text
                )}
              </span>
              
              {/* Decorative Circle Accent - Scandinavian Style */}
              <div className={`w-6 h-6 md:w-10 md:h-10 rounded-full border-2 ${
                idx % 3 === 0 
                  ? "bg-primary border-primary/20 shadow-lg shadow-primary/20" 
                  : idx % 3 === 1 
                    ? "bg-secondary border-secondary/20 shadow-lg shadow-secondary/20"
                    : "border-border/60"
              }`} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
