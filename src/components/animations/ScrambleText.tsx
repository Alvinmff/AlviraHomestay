"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "framer-motion";

const CHARS = "!<>-_\\\\/[]{}—=+*^?#________";

interface ScrambleTextProps {
    text: string;
    className?: string;
    duration?: number;
}

export function ScrambleText({ text, className = "", duration = 1500 }: ScrambleTextProps) {
    const [displayText, setDisplayText] = useState("");
    const ref = React.useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    useEffect(() => {
        if (!isInView) return;

        let frame = 0;
        const length = text.length;
        const updateTime = 30; // ms per frame
        const totalFrames = duration / updateTime;

        const queue: Array<{ from: string; to: string; start: number; end: number; char?: string }> = [];

        for (let i = 0; i < length; i++) {
            const start = Math.floor(Math.random() * totalFrames * 0.5);
            const end = start + Math.floor(Math.random() * totalFrames * 0.5);
            queue.push({
                from: CHARS[Math.floor(Math.random() * CHARS.length)],
                to: text[i],
                start,
                end,
            });
        }

        const interval = setInterval(() => {
            let output = "";
            let complete = 0;

            for (let i = 0; i < length; i++) {
                const { from, to, start, end, char } = queue[i];

                if (frame >= end) {
                    complete++;
                    output += to;
                } else if (frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        queue[i].char = CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                    output += `<span class="opacity-50">${queue[i].char}</span>`;
                } else {
                    output += from;
                }
            }

            setDisplayText(output);

            if (complete === length) {
                clearInterval(interval);
            }
            frame++;
        }, updateTime);

        return () => clearInterval(interval);
    }, [text, duration, isInView]);

    return (
        <span
            ref={ref}
            className={className}
            dangerouslySetInnerHTML={{ __html: displayText || text.replace(/./g, ' ') }}
        />
    );
}
