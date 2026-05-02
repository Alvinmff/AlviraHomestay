"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function LivingBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let particles: Array<{ x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }> = [];
        const particleCount = 25; // very subtle — Scandinavian calm

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.5 + 0.3,
                    speedX: (Math.random() - 0.5) * 0.15,
                    speedY: (Math.random() - 0.5) * 0.15 - 0.05,
                    opacity: Math.random() * 0.3 + 0.05,
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const isDark = theme === "dark";
            // Warm earthy dust: sage-tinted in light, warm white in dark
            const particleColor = isDark ? "rgba(210, 200, 180," : "rgba(94, 122, 90,";

            particles.forEach((p) => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `${particleColor} ${p.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        createParticles();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [theme]);

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none w-full h-full overflow-hidden">
            {/* Soft organic gradient — warm cream to sage whisper */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#f0ebe4]/40 via-background to-[#e8ede6]/30 dark:from-[#1a1714]/40 dark:via-background dark:to-[#1a1f19]/30 transition-colors duration-1000" />

            {/* Canvas for floating dust particles */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40 mix-blend-multiply dark:mix-blend-plus-lighter" />

            {/* Noise texture overlay — very subtle */}
            <div
                className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    mixBlendMode: 'overlay',
                }}
            />
        </div>
    );
}
