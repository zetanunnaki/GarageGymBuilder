"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  label: string;
}

export function AnimatedCounter({ value, label }: AnimatedCounterProps) {
  const [displayed, setDisplayed] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  });

  const animateValue = () => {
    const numericMatch = value.match(/(\d+)/);
    if (!numericMatch) {
      setDisplayed(value);
      return;
    }

    const target = parseInt(numericMatch[1]);
    const prefix = value.slice(0, value.indexOf(numericMatch[1]));
    const suffix = value.slice(
      value.indexOf(numericMatch[1]) + numericMatch[1].length
    );
    const duration = 1200;
    const steps = 30;
    const stepDuration = duration / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += Math.ceil(target / steps);
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setDisplayed(`${prefix}${current}${suffix}`);
    }, stepDuration);
  };

  return (
    <div ref={ref} className="px-6 py-6 text-center">
      <p className="text-2xl font-black italic text-orange-500">{displayed}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
        {label}
      </p>
    </div>
  );
}
