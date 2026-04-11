import { Metadata } from "next";
import { Dumbbell } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about GarageGymBuilder and our mission to help you build the perfect home gym.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      <div className="mb-8 flex items-center gap-3">
        <div className="skew-x-[-12deg] bg-orange-600 p-1.5">
          <Dumbbell className="skew-x-[12deg] text-black" size={24} />
        </div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">
          About Us
        </h1>
      </div>

      <div className="prose prose-lg prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-p:text-zinc-400 prose-p:leading-relaxed prose-strong:text-zinc-200">
        <p>
          GarageGymBuilder was founded with a simple mission: help people build
          great home gyms without wasting money on equipment they don&apos;t
          need.
        </p>

        <h2>Our Testing Process</h2>
        <p>
          Every product we recommend has been personally tested by our team. We
          don&apos;t just read spec sheets — we assemble, lift on, and live with
          the equipment before writing a single word.
        </p>

        <h2>How We Make Money</h2>
        <p>
          GarageGymBuilder is reader-supported. When you buy through links on our
          site, we may earn an affiliate commission at no additional cost to you.
          This helps us keep testing equipment and publishing free content.
        </p>
        <p>
          Our affiliate relationships never influence our recommendations. If a
          product isn&apos;t good enough for our own gyms, we won&apos;t
          recommend it for yours.
        </p>

        <h2>Contact</h2>
        <p>
          Have questions, feedback, or want to work with us? Reach out at{" "}
          <strong>hello@garagegymbuilders.com</strong>.
        </p>
      </div>
    </div>
  );
}
