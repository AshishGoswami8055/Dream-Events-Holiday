"use client";

import { useEffect, useRef, useState } from "react";
import { TRAVEL_STATS } from "@/constants";
import { FadeIn } from "@/components/shared/motion";

/** Only animate simple numeric stats like "6,000+" or "180+". */
function parseAnimatableStat(value: string) {
  const match = value.match(/^([\d,]+)(\+?)$/);
  if (!match) return null;
  const numericPart = parseInt(match[1].replace(/,/g, ""), 10);
  if (Number.isNaN(numericPart)) return null;
  return { numericPart, suffix: match[2], hasComma: match[1].includes(",") };
}

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const parsed = parseAnimatableStat(value);
    if (!parsed) {
      setDisplayValue(value);
      return;
    }

    setDisplayValue("0" + parsed.suffix);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let current = 0;
          const increment = parsed.numericPart / 50;
          const timer = setInterval(() => {
            current += increment;
            if (current >= parsed.numericPart) {
              setDisplayValue(value);
              clearInterval(timer);
            } else {
              const rounded = Math.floor(current);
              const formatted = parsed.hasComma
                ? rounded.toLocaleString("en-IN")
                : String(rounded);
              setDisplayValue(formatted + parsed.suffix);
            }
          }, 30);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-bold text-white md:text-5xl">{displayValue}</p>
      <p className="mt-2 text-sm text-white/70 md:text-base">{label}</p>
    </div>
  );
}

export function TravelStatistics() {
  return (
    <section className="relative overflow-hidden py-24" aria-label="Travel statistics">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white blur-3xl" />
      </div>

      <div className="container-custom relative">
        <FadeIn>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {TRAVEL_STATS.map((stat) => (
              <AnimatedCounter key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
