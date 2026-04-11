"use client";

import { useState } from "react";
import { Calculator, Check, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

interface EquipmentItem {
  name: string;
  minPrice: number;
  maxPrice: number;
  priority: "essential" | "recommended" | "optional";
  category: string;
}

const equipment: EquipmentItem[] = [
  { name: "Power Rack / Squat Stand", minPrice: 120, maxPrice: 850, priority: "essential", category: "Strength" },
  { name: "Olympic Barbell", minPrice: 150, maxPrice: 350, priority: "essential", category: "Strength" },
  { name: "Weight Plates (300 lb set)", minPrice: 200, maxPrice: 500, priority: "essential", category: "Strength" },
  { name: "Gym Flooring", minPrice: 80, maxPrice: 300, priority: "essential", category: "Setup" },
  { name: "Adjustable Bench", minPrice: 100, maxPrice: 400, priority: "recommended", category: "Strength" },
  { name: "Adjustable Dumbbells", minPrice: 200, maxPrice: 500, priority: "recommended", category: "Strength" },
  { name: "Pull-Up Bar", minPrice: 25, maxPrice: 80, priority: "recommended", category: "Bodyweight" },
  { name: "Air Bike / Rower", minPrice: 200, maxPrice: 800, priority: "optional", category: "Cardio" },
  { name: "Resistance Bands", minPrice: 20, maxPrice: 50, priority: "optional", category: "Accessories" },
  { name: "Dip Attachment", minPrice: 40, maxPrice: 120, priority: "optional", category: "Accessories" },
  { name: "Lat Pulldown Attachment", minPrice: 150, maxPrice: 400, priority: "optional", category: "Accessories" },
  { name: "Specialty Barbell", minPrice: 100, maxPrice: 300, priority: "optional", category: "Strength" },
];

const priorityColors = {
  essential: "text-red-500",
  recommended: "text-orange-500",
  optional: "text-zinc-500",
};

const priorityBg = {
  essential: "bg-red-500/10 border-red-500/30",
  recommended: "bg-orange-500/10 border-orange-500/30",
  optional: "bg-zinc-500/10 border-zinc-800",
};

export default function CalculatorPage() {
  const [selected, setSelected] = useState<Set<number>>(new Set([0, 1, 2, 3]));
  const [quality, setQuality] = useState<"budget" | "mid" | "premium">("mid");

  const qualityMultiplier = quality === "budget" ? 0 : quality === "mid" ? 0.5 : 1;

  const total = Array.from(selected).reduce((sum, idx) => {
    const item = equipment[idx];
    return sum + item.minPrice + (item.maxPrice - item.minPrice) * qualityMultiplier;
  }, 0);

  const toggle = (idx: number) => {
    const next = new Set(selected);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelected(next);
  };

  const suggestedBuild =
    total <= 600 ? "/builds/home-gym-under-500" :
    total <= 1200 ? "/builds/home-gym-under-1000" :
    "/builds/home-gym-under-2000";

  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-20">
      <header className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <div className="skew-x-[-12deg] bg-orange-600 p-2">
            <Calculator className="skew-x-[12deg] text-black" size={24} />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            Tool
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-black uppercase italic tracking-tighter md:text-5xl">
          Budget Calculator
        </h1>
        <p className="max-w-2xl text-lg text-zinc-500">
          Select your equipment and quality level to estimate your total home gym
          cost.
        </p>
      </header>

      {/* Quality Selector */}
      <div className="mb-8 flex gap-2">
        {(["budget", "mid", "premium"] as const).map((q) => (
          <button
            key={q}
            onClick={() => setQuality(q)}
            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
              quality === q
                ? "skew-x-[-12deg] bg-orange-600 text-white"
                : "border border-zinc-800 text-zinc-500 hover:border-orange-600/50"
            }`}
          >
            <span className={quality === q ? "inline-block skew-x-[12deg]" : ""}>
              {q}
            </span>
          </button>
        ))}
      </div>

      {/* Equipment List */}
      <div className="space-y-2">
        {equipment.map((item, idx) => {
          const isSelected = selected.has(idx);
          const price = Math.round(
            item.minPrice + (item.maxPrice - item.minPrice) * qualityMultiplier
          );
          return (
            <button
              key={idx}
              onClick={() => toggle(idx)}
              className={`flex w-full items-center gap-4 border p-4 text-left transition-all ${
                isSelected
                  ? priorityBg[item.priority]
                  : "border-zinc-800/50 opacity-50 hover:opacity-80"
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center border ${
                  isSelected
                    ? "border-orange-600 bg-orange-600"
                    : "border-zinc-700"
                }`}
              >
                {isSelected && <Check size={14} className="text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{item.name}</span>
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest ${priorityColors[item.priority]}`}
                  >
                    {item.priority}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-zinc-600">
                  {item.category}
                </span>
              </div>
              <span className="text-sm font-black italic text-orange-500">
                ${price}
              </span>
            </button>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-8 border-2 border-orange-600/30 bg-orange-600/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Estimated Total
            </p>
            <p className="text-4xl font-black italic text-orange-500">
              ${Math.round(total).toLocaleString()}
            </p>
          </div>
          <Link
            href={suggestedBuild}
            className="skew-x-[-12deg] bg-orange-600 px-6 py-3 font-black uppercase italic text-white transition hover:bg-orange-500"
          >
            <span className="flex skew-x-[12deg] items-center gap-2 text-sm">
              See Build Guide <ArrowRight size={16} />
            </span>
          </Link>
        </div>
        <p className="mt-3 text-xs text-zinc-600">
          {selected.size} items selected &middot;{" "}
          {quality.charAt(0).toUpperCase() + quality.slice(1)} quality tier
        </p>
      </div>
    </div>
  );
}
