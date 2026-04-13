"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  Check,
  ArrowRight,
  Target,
  Ruler,
  Dumbbell,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import productsData from "@/data/products.json";
import type { Product } from "@/lib/products";

const products = productsData as Record<string, Product>;

type Goal = "general" | "powerlifter" | "bodybuilder" | "crossfit" | "mma";
type SpaceSize = "small" | "medium" | "large";

interface PickOption {
  id: string;
  category: string;
  priority: "essential" | "recommended" | "optional";
  goals: Goal[];
  minSpace: SpaceSize; // smallest space that supports it
  slug?: string; // review slug for linking
}

// Map catalog product IDs to goals, priority, space requirements
const options: PickOption[] = [
  // Essential for all
  {
    id: "fitness-reality-810xlt",
    category: "Power Rack",
    priority: "essential",
    goals: ["general", "powerlifter", "bodybuilder", "crossfit"],
    minSpace: "medium",
    slug: "fitness-reality-810xlt-review",
  },
  {
    id: "cap-barbell-olympic",
    category: "Barbell + Plates",
    priority: "essential",
    goals: ["general", "powerlifter", "bodybuilder", "crossfit"],
    minSpace: "medium",
    slug: "cap-barbell-300-review",
  },
  {
    id: "synergee-olympic-barbell",
    category: "Upgrade Barbell",
    priority: "recommended",
    goals: ["powerlifter", "crossfit"],
    minSpace: "medium",
    slug: "synergee-olympic-barbell-review",
  },
  {
    id: "flybird-adjustable-bench",
    category: "Bench",
    priority: "essential",
    goals: ["general", "powerlifter", "bodybuilder", "crossfit"],
    minSpace: "small",
    slug: "flybird-adjustable-bench-review",
  },
  // Bodybuilder focus
  {
    id: "sportsroyals-power-cage",
    category: "Rack + Cables",
    priority: "recommended",
    goals: ["bodybuilder"],
    minSpace: "large",
    slug: "sportsroyals-power-cage-review",
  },
  {
    id: "bowflex-selecttech-552",
    category: "Dumbbells",
    priority: "recommended",
    goals: ["general", "bodybuilder", "powerlifter"],
    minSpace: "small",
    slug: "bowflex-selecttech-552-review",
  },
  {
    id: "cap-hex-dumbbells",
    category: "Fixed Dumbbells",
    priority: "recommended",
    goals: ["bodybuilder", "general"],
    minSpace: "medium",
    slug: "cap-hex-dumbbells-review",
  },
  // Powerlifter focus
  {
    id: "yes4all-hex-trap-bar",
    category: "Trap Bar",
    priority: "recommended",
    goals: ["powerlifter", "general", "bodybuilder"],
    minSpace: "medium",
    slug: "yes4all-hex-trap-bar-review",
  },
  {
    id: "dark-iron-lifting-belt",
    category: "Lifting Belt",
    priority: "recommended",
    goals: ["powerlifter", "bodybuilder"],
    minSpace: "small",
    slug: "dark-iron-lifting-belt-review",
  },
  {
    id: "yes4all-roman-chair",
    category: "Hyperextension",
    priority: "optional",
    goals: ["powerlifter", "bodybuilder"],
    minSpace: "medium",
    slug: "yes4all-roman-chair-review",
  },
  // CrossFit focus
  {
    id: "yes4all-kettlebell-set",
    category: "Kettlebells",
    priority: "recommended",
    goals: ["crossfit", "mma", "general"],
    minSpace: "small",
    slug: "yes4all-kettlebell-set-review",
  },
  {
    id: "yes4all-plyo-box",
    category: "Plyo Box",
    priority: "recommended",
    goals: ["crossfit", "mma"],
    minSpace: "medium",
    slug: "yes4all-plyo-box-review",
  },
  {
    id: "rogue-style-gymnastic-rings",
    category: "Gymnastic Rings",
    priority: "recommended",
    goals: ["crossfit", "mma", "general"],
    minSpace: "small",
    slug: "rogue-style-gymnastic-rings-review",
  },
  {
    id: "yes4all-slam-ball",
    category: "Slam Ball",
    priority: "optional",
    goals: ["crossfit", "mma"],
    minSpace: "small",
    slug: "yes4all-slam-ball-review",
  },
  // MMA focus
  {
    id: "rogue-style-weight-vest",
    category: "Weight Vest",
    priority: "recommended",
    goals: ["mma", "crossfit"],
    minSpace: "small",
    slug: "rogue-style-weight-vest-review",
  },
  {
    id: "yes4all-sandbag",
    category: "Sandbag",
    priority: "recommended",
    goals: ["mma", "crossfit"],
    minSpace: "small",
    slug: "yes4all-sandbag-review",
  },
  // Cardio
  {
    id: "sunny-sf-rw5515-rower",
    category: "Rowing Machine",
    priority: "optional",
    goals: ["general", "crossfit", "mma"],
    minSpace: "large",
    slug: "sunny-sf-rw5515-rower-review",
  },
  {
    id: "assault-airbike-classic",
    category: "Air Bike",
    priority: "optional",
    goals: ["crossfit", "mma"],
    minSpace: "large",
    slug: "assault-airbike-review",
  },
  // Universal accessories
  {
    id: "wod-nation-jump-rope",
    category: "Jump Rope",
    priority: "optional",
    goals: ["general", "crossfit", "mma", "bodybuilder"],
    minSpace: "small",
    slug: "wod-nation-jump-rope-review",
  },
  {
    id: "bodylastics-resistance-bands",
    category: "Resistance Bands",
    priority: "optional",
    goals: ["general", "mma", "bodybuilder"],
    minSpace: "small",
    slug: "bodylastics-resistance-bands-review",
  },
  {
    id: "iron-bull-dip-belt",
    category: "Dip Belt",
    priority: "optional",
    goals: ["bodybuilder", "crossfit", "general"],
    minSpace: "small",
    slug: "iron-bull-dip-belt-review",
  },
  {
    id: "iron-gym-pull-up-bar",
    category: "Doorway Pull-Up Bar",
    priority: "optional",
    goals: ["general", "mma"],
    minSpace: "small",
    slug: "iron-gym-pull-up-bar-review",
  },
  {
    id: "perfect-fitness-ab-wheel",
    category: "Ab Wheel",
    priority: "optional",
    goals: ["bodybuilder", "general", "crossfit"],
    minSpace: "small",
    slug: "perfect-fitness-ab-wheel-review",
  },
  {
    id: "nordic-lifting-knee-sleeves",
    category: "Knee Sleeves",
    priority: "recommended",
    goals: ["powerlifter", "bodybuilder"],
    minSpace: "small",
    slug: "nordic-lifting-knee-sleeves-review",
  },
  {
    id: "harbinger-lifting-straps",
    category: "Lifting Straps",
    priority: "optional",
    goals: ["powerlifter", "bodybuilder"],
    minSpace: "small",
    slug: "harbinger-lifting-straps-review",
  },
  {
    id: "rip-toned-wrist-wraps",
    category: "Wrist Wraps",
    priority: "recommended",
    goals: ["powerlifter", "bodybuilder"],
    minSpace: "small",
    slug: "rip-toned-wrist-wraps-review",
  },
  {
    id: "luxfit-foam-roller",
    category: "Foam Roller",
    priority: "recommended",
    goals: ["general", "powerlifter", "bodybuilder", "crossfit", "mma"],
    minSpace: "small",
    slug: "luxfit-foam-roller-review",
  },
  {
    id: "power-guidance-battle-rope",
    category: "Battle Rope",
    priority: "optional",
    goals: ["crossfit", "mma"],
    minSpace: "large",
    slug: "power-guidance-battle-rope-review",
  },
  {
    id: "yes4all-parallettes",
    category: "Parallettes",
    priority: "optional",
    goals: ["general", "crossfit"],
    minSpace: "small",
    slug: "yes4all-parallettes-review",
  },
];

const spaceRank: Record<SpaceSize, number> = { small: 0, medium: 1, large: 2 };

function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
}

const priorityColors = {
  essential: "border-red-500/40 bg-red-500/5",
  recommended: "border-orange-500/40 bg-orange-500/5",
  optional: "border-zinc-700 bg-zinc-900/40",
};

const priorityLabel = {
  essential: "Must Have",
  recommended: "Recommended",
  optional: "Optional",
};

const goalLabels: Record<Goal, { label: string; desc: string; icon: typeof Target }> = {
  general: { label: "General Fitness", desc: "Balanced strength + cardio", icon: Dumbbell },
  powerlifter: { label: "Powerlifter", desc: "Squat, bench, deadlift focus", icon: ShieldCheck },
  bodybuilder: { label: "Bodybuilder", desc: "Hypertrophy + variety", icon: Target },
  crossfit: { label: "CrossFit", desc: "Constantly varied WODs", icon: Dumbbell },
  mma: { label: "Combat Sports", desc: "Conditioning + functional", icon: Target },
};

const spaceLabels: Record<SpaceSize, { label: string; desc: string }> = {
  small: { label: "Small", desc: "Under 80 sq ft (apartment/corner)" },
  medium: { label: "Medium", desc: "80-150 sq ft (bedroom/single bay)" },
  large: { label: "Large", desc: "150+ sq ft (dedicated garage)" },
};

export default function CalculatorPage() {
  const [goal, setGoal] = useState<Goal>("general");
  const [space, setSpace] = useState<SpaceSize>("medium");
  const [budget, setBudget] = useState<number>(1500);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());

  const recommended = useMemo(() => {
    // Filter by goal + space
    const relevant = options.filter(
      (opt) => opt.goals.includes(goal) && spaceRank[opt.minSpace] <= spaceRank[space]
    );

    // Sort: essential → recommended → optional, then by price
    const sorted = [...relevant].sort((a, b) => {
      const priOrder = { essential: 0, recommended: 1, optional: 2 };
      if (priOrder[a.priority] !== priOrder[b.priority]) {
        return priOrder[a.priority] - priOrder[b.priority];
      }
      return (
        parsePrice(products[a.id]?.price || "0") -
        parsePrice(products[b.id]?.price || "0")
      );
    });

    // Greedy: fit as many essential first, then recommended, then optional
    let running = 0;
    const picked: PickOption[] = [];
    const skipped: PickOption[] = [];

    for (const opt of sorted) {
      if (excluded.has(opt.id)) {
        skipped.push(opt);
        continue;
      }
      const price = parsePrice(products[opt.id]?.price || "0");
      if (opt.priority === "essential") {
        // Always include essentials even if they push over budget (flag overrun)
        picked.push(opt);
        running += price;
      } else if (running + price <= budget) {
        picked.push(opt);
        running += price;
      } else {
        skipped.push(opt);
      }
    }

    return { picked, skipped, total: running };
  }, [goal, space, budget, excluded]);

  const budgetOver = recommended.total > budget;
  const budgetPercent = Math.min(100, (recommended.total / budget) * 100);

  const suggestedBuild =
    goal === "powerlifter"
      ? "/builds/powerlifter-home-gym-build/"
      : goal === "bodybuilder"
      ? "/builds/bodybuilder-home-gym-build/"
      : goal === "crossfit"
      ? "/builds/crossfit-home-gym-build/"
      : goal === "mma"
      ? "/builds/mma-fighter-home-gym-build/"
      : budget <= 600
      ? "/builds/home-gym-under-500/"
      : budget <= 1100
      ? "/builds/home-gym-under-1000/"
      : budget <= 2200
      ? "/builds/home-gym-under-2000/"
      : "/builds/dream-gym-under-5000/";

  const toggle = (id: string) => {
    const next = new Set(excluded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExcluded(next);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
      <header className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <div className="skew-x-[-12deg] bg-orange-600 p-2">
            <Calculator className="skew-x-[12deg] text-black" size={24} />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            Smart Tool
          </div>
        </div>
        <h1 className="mb-4 text-5xl font-black uppercase italic leading-[0.85] tracking-tighter md:text-6xl">
          Build <br />
          <span className="bg-gradient-to-br from-orange-300 via-orange-500 to-orange-800 bg-clip-text text-transparent">
            Planner
          </span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-zinc-500">
          Pick your training goal, space, and budget. We&apos;ll match real
          Amazon/Walmart products from our tested catalog.
        </p>
      </header>

      {/* Goal Selector */}
      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Target size={12} /> Training Goal
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {(Object.keys(goalLabels) as Goal[]).map((g) => {
            const Icon = goalLabels[g].icon;
            return (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`group flex flex-col items-start gap-2 border p-4 text-left transition-all ${
                  goal === g
                    ? "border-orange-600 bg-orange-600/10"
                    : "border-zinc-800 bg-zinc-900/40 hover:border-orange-600/40"
                }`}
              >
                <Icon
                  size={18}
                  className={goal === g ? "text-orange-500" : "text-zinc-600"}
                />
                <div>
                  <div
                    className={`text-sm font-black uppercase italic tracking-tighter ${
                      goal === g ? "text-orange-400" : "text-zinc-200"
                    }`}
                  >
                    {goalLabels[g].label}
                  </div>
                  <div className="mt-0.5 text-[10px] leading-tight text-zinc-600">
                    {goalLabels[g].desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Space Selector */}
      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Ruler size={12} /> Available Space
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {(Object.keys(spaceLabels) as SpaceSize[]).map((s) => (
            <button
              key={s}
              onClick={() => setSpace(s)}
              className={`border p-4 text-left transition-all ${
                space === s
                  ? "border-orange-600 bg-orange-600/10"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-orange-600/40"
              }`}
            >
              <div
                className={`text-sm font-black uppercase italic tracking-tighter ${
                  space === s ? "text-orange-400" : "text-zinc-200"
                }`}
              >
                {spaceLabels[s].label}
              </div>
              <div className="mt-0.5 text-[10px] text-zinc-600">
                {spaceLabels[s].desc}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Budget Slider */}
      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Calculator size={12} /> Budget
          </div>
          <div className="text-2xl font-black italic text-orange-500">
            ${budget.toLocaleString()}
          </div>
        </div>
        <input
          type="range"
          min={500}
          max={5000}
          step={100}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full accent-orange-600"
          aria-label="Budget"
        />
        <div className="mt-1 flex justify-between text-[10px] tracking-widest text-zinc-600">
          <span>$500</span>
          <span>$5,000</span>
        </div>
      </section>

      {/* Results */}
      <section className="mb-10 border-2 border-orange-600/30 bg-orange-600/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Recommended Total
            </p>
            <p
              className={`text-5xl font-black italic ${
                budgetOver ? "text-red-400" : "text-orange-500"
              }`}
            >
              ${Math.round(recommended.total).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {recommended.picked.length} items &middot;{" "}
              {goalLabels[goal].label} &middot; {spaceLabels[space].label} space
            </p>
          </div>
          <Link
            href={suggestedBuild}
            className="skew-x-[-12deg] bg-orange-600 px-6 py-3 font-black uppercase italic text-white transition hover:bg-orange-500"
          >
            <span className="flex skew-x-[12deg] items-center gap-2 text-sm">
              See Full Build Guide <ArrowRight size={16} />
            </span>
          </Link>
        </div>
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden bg-zinc-900">
            <div
              className={`h-full transition-all ${
                budgetOver
                  ? "bg-red-500"
                  : "bg-gradient-to-r from-orange-600 to-orange-400"
              }`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
          {budgetOver && (
            <p className="mt-2 text-xs text-red-400">
              ⚠ Essentials exceed budget. Consider increasing budget or
              excluding items below.
            </p>
          )}
        </div>
      </section>

      {/* Picked Items */}
      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Check size={12} /> Your Recommended Kit ({recommended.picked.length})
        </h2>
        <div className="space-y-2">
          {recommended.picked.map((opt) => {
            const product = products[opt.id];
            if (!product) return null;
            const price = parsePrice(product.price);
            return (
              <div
                key={opt.id}
                className={`flex items-center gap-4 border p-4 ${
                  priorityColors[opt.priority]
                }`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-orange-600 bg-orange-600">
                  <Check size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-black uppercase italic tracking-tighter text-zinc-100">
                      {product.name}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">
                      {priorityLabel[opt.priority]}
                    </span>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-600">
                    {opt.category} &middot; {product.brand}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black italic text-orange-500">
                    ${price}
                  </span>
                  {opt.slug && (
                    <Link
                      href={`/reviews/${opt.slug}/`}
                      className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-orange-500"
                    >
                      Review &rarr;
                    </Link>
                  )}
                  <button
                    onClick={() => toggle(opt.id)}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-400"
                    aria-label={`Remove ${product.name}`}
                  >
                    Skip
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Skipped Items */}
      {recommended.skipped.length > 0 && (
        <section>
          <h2 className="mb-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Not in budget ({recommended.skipped.length})
          </h2>
          <div className="space-y-2 opacity-60">
            {recommended.skipped.map((opt) => {
              const product = products[opt.id];
              if (!product) return null;
              const price = parsePrice(product.price);
              const isExcluded = excluded.has(opt.id);
              return (
                <div
                  key={opt.id}
                  className="flex items-center gap-4 border border-zinc-800/50 p-4"
                >
                  <div className="h-6 w-6 shrink-0 border border-zinc-700" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-bold text-zinc-400">
                      {product.name}
                    </div>
                    <div className="text-[10px] text-zinc-600">
                      {opt.category}
                    </div>
                  </div>
                  <span className="text-sm font-bold italic text-zinc-500">
                    ${price}
                  </span>
                  {isExcluded && (
                    <button
                      onClick={() => toggle(opt.id)}
                      className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400"
                    >
                      Restore
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
