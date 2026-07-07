"use client";

import { useEffect, useRef, useState } from "react";
import { TRAVEL_STATS } from "@/constants";
import { FadeIn } from "@/components/shared/motion";

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numericPart = parseInt(value.replace(/\D/g, ""), 10);
          const suffix = value.replace(/[\d]/g, "");
          let current = 0;
          const increment = numericPart / 50;
          const timer = setInterval(() => {
            current += increment;
            if (current >= numericPart) {
              setDisplayValue(value);
              clearInterval(timer);
            } else {
              setDisplayValue(Math.floor(current) + suffix);
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
      <p className="text-4xl font-bold text-white md:text-5xl">{displayValue}</p>
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
