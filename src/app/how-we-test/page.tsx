import { Metadata } from "next";
import { FlaskConical, Clock, Weight, Shield, Wrench, DollarSign } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { absoluteUrl, SITE } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "How We Test Equipment",
  description:
    "Our testing methodology for home gym equipment. Every product we recommend has been purchased, built, and beaten on by our team.",
  path: "/how-we-test/",
  image: "/og-default.png",
  keywords: [
    "how we test home gym equipment",
    "home gym review methodology",
    "editorial standards",
  ],
});

const testingSteps = [
  {
    icon: DollarSign,
    title: "We Buy It",
    description:
      "We purchase every product with our own money. No free samples, no sponsored units. If we wouldn't spend our own cash on it, we won't review it.",
  },
  {
    icon: Wrench,
    title: "We Build It",
    description:
      "Every piece of equipment gets assembled from scratch. We time the assembly, rate the instructions, and note any issues with hardware or fit.",
  },
  {
    icon: Weight,
    title: "We Train With It",
    description:
      "Minimum 30 days of daily use before publishing. We test under real training conditions — heavy squats, bench press, deadlifts, and conditioning work.",
  },
  {
    icon: Shield,
    title: "We Stress Test It",
    description:
      "We load equipment to 80%+ of rated capacity and check for flex, wobble, and structural concerns. Safety is non-negotiable.",
  },
  {
    icon: Clock,
    title: "We Live With It",
    description:
      "Long-term durability matters. We update reviews after 3, 6, and 12 months to report on wear, rust, and any degradation.",
  },
  {
    icon: FlaskConical,
    title: "We Compare It",
    description:
      "Every product is evaluated against its direct competitors. We don't review in a vacuum — we tell you what else is worth considering.",
  },
];

export default function HowWeTestPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How We Test Home Gym Equipment",
    description:
      "Our testing methodology for home gym equipment. Every product we recommend has been purchased, built, and beaten on by our team.",
    url: absoluteUrl("/how-we-test/"),
    step: testingSteps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
    />
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
      <header className="mb-16">
        <div className="mb-4 flex items-center gap-3">
          <div className="skew-x-[-12deg] bg-orange-600 p-2">
            <FlaskConical className="skew-x-[12deg] text-black" size={24} />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            Our Process
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-black uppercase italic tracking-tighter md:text-5xl">
          How We Test
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400">
          Every product on GarageGymBuilders has been purchased, assembled, and
          trained with by our team. Here&apos;s exactly how we evaluate
          equipment.
        </p>
      </header>

      {/* Steps */}
      <div className="space-y-6">
        {testingSteps.map((step, i) => (
          <div
            key={step.title}
            className="flex gap-6 border border-zinc-800 bg-zinc-900/40 p-6"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-orange-600/10">
              <step.icon className="text-orange-500" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black tracking-widest text-zinc-400">
                  STEP {i + 1}
                </span>
                <h2 className="text-lg font-black uppercase italic tracking-tighter">
                  {step.title}
                </h2>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rating System */}
      <section className="mt-16">
        <h2 className="mb-8 border-l-8 border-orange-600 pl-6 text-2xl font-black uppercase italic tracking-tighter">
          Our Rating System
        </h2>
        <div className="space-y-3">
          {[
            { rating: "4.5 - 5.0", label: "Outstanding", desc: "Best-in-class. Buy with confidence." },
            { rating: "4.0 - 4.4", label: "Excellent", desc: "Minor trade-offs, but highly recommended." },
            { rating: "3.5 - 3.9", label: "Good", desc: "Solid choice with notable compromises." },
            { rating: "3.0 - 3.4", label: "Average", desc: "Gets the job done, better options exist." },
            { rating: "Below 3.0", label: "Not Recommended", desc: "We won't feature it." },
          ].map((tier) => (
            <div
              key={tier.rating}
              className="flex items-center gap-4 border border-zinc-800 bg-zinc-900/30 px-6 py-3"
            >
              <span className="w-24 text-sm font-black italic text-orange-500">
                {tier.rating}
              </span>
              <span className="w-32 text-sm font-bold">{tier.label}</span>
              <span className="text-sm text-zinc-400">{tier.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Transparency */}
      <section className="mt-16 border border-zinc-800 bg-zinc-900/30 p-8">
        <h2 className="mb-4 text-xl font-black uppercase italic tracking-tighter">
          Our Promise
        </h2>
        <div className="space-y-3 text-sm text-zinc-400">
          <p>
            We earn revenue through affiliate commissions when you purchase
            through our links. This never influences our ratings or
            recommendations.
          </p>
          <p>
            If a product doesn&apos;t meet our standards, we don&apos;t feature
            it — regardless of the commission rate. We&apos;d rather recommend
            nothing than recommend something we wouldn&apos;t use ourselves.
          </p>
          <p>
            Every rating is based on hands-on testing, not spec sheets. If we
            haven&apos;t used it, we say so clearly.
          </p>
        </div>
      </section>
    </div>
    </>
  );
}
