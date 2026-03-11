"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface SmoothCounterProps {
    from?: number;
    to: number;
    duration?: number;
    delay?: number;
    className?: string;
    prefix?: string;
    suffix?: string;
}

export function SmoothCounter({
    from = 0,
    to,
    duration = 2,
    delay = 0,
    className = "",
    prefix = "",
    suffix = ""
}: SmoothCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const motionValue = useMotionValue(from);
    const springValue = useSpring(motionValue, {
        damping: 50,
        stiffness: 100,
        duration: duration * 1000
    });

    useEffect(() => {
        if (isInView) {
            setTimeout(() => {
                motionValue.set(to);
            }, delay * 1000);
        }
    }, [motionValue, isInView, to, delay]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = `${prefix}${Intl.NumberFormat("id-ID").format(Math.round(latest))}${suffix}`;
            }
        });
    }, [springValue, prefix, suffix]);

    return (
        <span ref={ref} className={className}>
            {prefix}{Intl.NumberFormat("id-ID").format(from)}{suffix}
        </span>
    );
}
