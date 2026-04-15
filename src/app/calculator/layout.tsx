import { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

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

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
