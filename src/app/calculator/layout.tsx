import { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { generateSoftwareApplicationSchema } from "@/lib/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Smart Budget Calculator",
  description:
    "Build your perfect home gym by goal, space, and budget. Get instant product recommendations — tested picks, not affiliate noise.",
  path: "/calculator/",
  image: "/og-default.png",
  keywords: [
    "home gym calculator",
    "home gym budget calculator",
    "home gym planner",
    "garage gym planner",
  ],
});

const calculatorSchema = generateSoftwareApplicationSchema(
  "Home Gym Budget Calculator",
  "Build your perfect home gym by goal, space, and budget. Get instant product recommendations — tested picks, not affiliate noise.",
  "/calculator/",
  [
    "Budget slider ($300–$5,000)",
    "Training goal selection",
    "Space size optimization",
    "Instant product recommendations",
  ]
);

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
      {children}
    </>
  );
}
