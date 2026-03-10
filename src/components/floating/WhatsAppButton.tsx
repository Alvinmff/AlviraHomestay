"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { generateWALink, WA_TEMPLATES } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Hide on admin pages
    if (pathname?.startsWith("/admin")) return null;

    // Delay entrance animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000); // 2s delay
        return () => clearTimeout(timer);
    }, []);

    const handleWhatsAppClick = () => {
        const link = generateWALink("081231646523", WA_TEMPLATES.general);
        window.open(link, "_blank", "noopener,noreferrer");
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center group">
            {/* Desktop expanded label on hover */}
            <div
                className={`hidden md:flex flex-col items-end mr-4 transition-all duration-300 origin-right ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    }`}
            >
                <div className="bg-white px-4 py-2 rounded-xl rounded-br-none shadow-lg border border-primary/10 mb-1">
                    <p className="text-sm font-semibold text-foreground">Chat Admin Alvira</p>
                    <p className="text-xs text-muted-foreground font-medium">0812-3164-6523</p>
                </div>
            </div>

            {/* The WhatsApp Button */}
            <button
                onClick={handleWhatsAppClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
          flex items-center justify-center 
          bg-[#25D366] text-white 
          w-14 h-14 md:w-16 md:h-16 rounded-full 
          shadow-[0_8px_25px_rgba(37,211,102,0.4)]
          hover:shadow-[0_12px_35px_rgba(37,211,102,0.6)]
          hover:scale-105 active:scale-95 
          transition-all duration-300
          animate-in slide-in-from-bottom-10 fade-in zoom-in-50
          relative
        `}
                aria-label="Chat WhatsApp Admin"
            >
                <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />

                {/* Pulse internal animation */}
                <span className="absolute inset-0 rounded-full border-4 border-[#25D366] opacity-0 animate-[ping_3s_ease-in-out_infinite_2s]"></span>
            </button>

            {/* Mobile Label (shown permanently on mobile if needed, or we can use the requested full width mobile style. The prompt asked for center bottom full width for mobile) */}
            <style jsx global>{`
        @media (max-width: 768px) {
          .mobile-wa-container {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 1rem;
            background: linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
            z-index: 50;
          }
          .mobile-wa-btn {
            display: flex !important;
            width: 100% !important;
            height: 3rem !important;
            border-radius: 0.5rem !important;
            justify-content: center !important;
            gap: 0.5rem !important;
          }
        }
      `}</style>
        </div>
    );
}
