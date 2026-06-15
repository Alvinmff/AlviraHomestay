"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { generateWALink, WA_TEMPLATES } from "@/lib/utils";
import { X } from "lucide-react";

const LOGO_URL = "/uploads/logo.png";

export function WhatsAppButton() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [autoShown, setAutoShown] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isClosedByUser, setIsClosedByUser] = useState(false);

    // Delay entrance animation for the button
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Auto-show popup after button appears (only once per session)
    useEffect(() => {
        if (!isVisible || autoShown) return;
        const timer = setTimeout(() => {
            setShowPopup(true);
            setAutoShown(true);
            // Auto-hide after 8 seconds if not hovering
            const hideTimer = setTimeout(() => {
                setShowPopup((prev) => {
                    // Only hide if user isn't hovering
                    return false;
                });
            }, 8000);
            return () => clearTimeout(hideTimer);
        }, 3000);
        return () => clearTimeout(timer);
    }, [isVisible, autoShown]);

    // Hide on admin pages
    if (pathname?.startsWith("/admin")) return null;

    const handleWhatsAppClick = () => {
        const link = generateWALink("081231646523", WA_TEMPLATES.general);
        window.open(link, "_blank", "noopener,noreferrer");
    };

    const handleMouseEnter = () => {
        // Prevent hover actions on mobile/touch devices and if user closed it
        if (isClosedByUser) return;
        if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
            setIsHovering(true);
            setShowPopup(true);
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        // Small delay before hiding to prevent flickering
        setTimeout(() => {
            setShowPopup(false);
        }, 300);
    };

    const handleClosePopup = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowPopup(false);
        setIsHovering(false);
        setIsClosedByUser(true);
    };

    if (!isVisible) return null;

    const popupVisible = showPopup || isHovering;

    return (
        <>
            {/* Styles */}
            <style jsx global>{`
                @keyframes wa-slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(16px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                @keyframes wa-slide-down {
                    from {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(16px) scale(0.95);
                    }
                }
                @keyframes wa-bounce-in {
                    0% {
                        opacity: 0;
                        transform: scale(0.3) translateY(40px);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05) translateY(-4px);
                    }
                    70% {
                        transform: scale(0.97) translateY(2px);
                    }
                    100% {
                        transform: scale(1) translateY(0);
                    }
                }
                @keyframes wa-pulse-ring {
                    0% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                    100% {
                        transform: scale(1.8);
                        opacity: 0;
                    }
                }
                .wa-popup-enter {
                    animation: wa-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .wa-popup-exit {
                    animation: wa-slide-down 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
                    pointer-events: none;
                }
                .wa-btn-enter {
                    animation: wa-bounce-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .wa-pulse-ring {
                    animation: wa-pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
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

            <div
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Chat Popup Bubble */}
                <div
                    className={`mb-4 ${popupVisible ? "wa-popup-enter" : "wa-popup-exit"}`}
                    style={{ 
                        display: popupVisible || showPopup ? "block" : "none",
                        transformOrigin: "bottom right"
                    }}
                >
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-zinc-700 overflow-hidden w-[280px] md:w-[320px]">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden ring-2 ring-white/30">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={LOGO_URL}
                                        alt="Homestay Alvira"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm leading-tight">Homestay Alvira</p>
                                    <p className="text-white/70 text-xs flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-[#25D366] inline-block"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClosePopup}
                                onTouchEnd={handleClosePopup}
                                className="text-white/60 hover:text-white transition-colors duration-200 p-2 md:p-1 rounded-lg hover:bg-white/10"
                                aria-label="Tutup popup"
                            >
                                <X className="w-5 h-5 md:w-4 md:h-4" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="px-4 py-4 bg-[#E5DDD5] dark:bg-zinc-900/50" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}>
                            {/* Chat Bubble */}
                            <div className="relative bg-white dark:bg-zinc-800 rounded-xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[90%]">
                                {/* Triangle pointer */}
                                <div className="absolute -left-2 top-0 w-0 h-0 border-t-[8px] border-t-white dark:border-t-zinc-800 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent" style={{ transform: "rotate(-90deg) translateX(-4px)" }}></div>
                                
                                <p className="text-[#075E54] dark:text-emerald-400 font-semibold text-xs mb-1">Homestay Alvira</p>
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                    Halo! 👋 Ada yang bisa kami bantu untuk mencari penginapan nyaman?
                                </p>
                                <p className="text-gray-400 dark:text-gray-500 text-[10px] text-right mt-1">
                                    {new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')}
                                </p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="px-4 py-3 bg-white dark:bg-zinc-800 border-t border-gray-100 dark:border-zinc-700">
                            <button
                                onClick={handleWhatsAppClick}
                                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-sm py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/30 active:scale-[0.98]"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                Mulai Chat
                            </button>
                        </div>
                    </div>

                    {/* Bottom triangle pointing to button */}
                    <div className="flex justify-end mr-5">
                        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white dark:border-t-zinc-800"></div>
                    </div>
                </div>

                {/* The WhatsApp FAB Button */}
                <button
                    onClick={handleWhatsAppClick}
                    className="wa-btn-enter flex items-center justify-center bg-[#25D366] text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_35px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 relative"
                    aria-label="Chat WhatsApp Admin"
                >
                    {/* WhatsApp Icon */}
                    <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 fill-current">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>

                    {/* Pulse ring animation */}
                    <span className="absolute inset-0 rounded-full border-[3px] border-[#25D366] wa-pulse-ring"></span>
                    
                    {/* Notification dot */}
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">1</span>
                    </span>
                </button>
            </div>
        </>
    );
}
