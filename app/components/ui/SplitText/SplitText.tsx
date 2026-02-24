"use client";

import { JSX, useEffect, useMemo, useRef, useState } from "react";

type SplitTextProps = {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements; // "h1", "h2", etc.
  threshold?: number; // % visible avant reveal
  rootMargin?: string; // ex: "0px 0px -10% 0px"
  staggerMs?: number; // delay entre mots
  once?: boolean; // reveal une seule fois
};

export function SplitText({
  text,
  className = "",
  as: Tag = "h2",
  threshold = 0.4,
  rootMargin = "0px 0px -10% 0px",
  staggerMs = 70,
  once = true,
}: SplitTextProps) {
  const elRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  const words = useMemo(() => text.trim().split(/\s+/), [text]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  return (
    <Tag ref={elRef as any} className={className}>
      <span className="inline-block">
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom">
            <span
              style={{ transitionDelay: `${i * staggerMs}ms` }}
              className={[
                "inline-block will-change-transform",
                "transition-[transform,opacity,filter] duration-700 ease-out",
                visible
                  ? "translate-y-0 opacity-100 blur-0"
                  : "translate-y-[120%] opacity-0 blur-[6px]",
              ].join(" ")}
            >
              {w}
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}