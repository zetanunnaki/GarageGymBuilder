import { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Mail, MessageSquare, Dumbbell } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Get in touch with the GarageGymBuilders team. Questions about reviews, partnership inquiries, or feedback — we'd love to hear from you.",
  path: "/contact/",
  keywords: ["contact", "email", "get in touch", "feedback"],
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
      <div className="mb-8 flex items-center gap-3">
        <div className="skew-x-[-12deg] bg-orange-600 p-1.5">
          <Mail className="skew-x-[12deg] text-black" size={24} />
        </div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">
          Contact Us
        </h1>
      </div>

      <div className="prose prose-lg prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-p:text-zinc-400 prose-p:leading-relaxed prose-strong:text-zinc-200">
        <p>
          Have a question about a product review, want to suggest equipment for
          us to test, or just want to talk home gyms? We read every message.
        </p>
      </div>

      {/* Contact cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:hello@garagegymbuilders.com"
          className="group block border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-orange-600/50"
        >
          <div className="mb-3 flex h-14 w-14 items-center justify-center bg-orange-600/10">
            <Mail className="text-orange-500" size={24} />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            Email
          </div>
          <p className="mb-2 text-base font-black uppercase italic tracking-tighter transition-colors group-hover:text-orange-500">
            hello@garagegymbuilders.com
          </p>
          <p className="text-xs leading-relaxed text-zinc-400">
            Best for review questions, feedback, and partnership inquiries. We
            typically respond within 48 hours.
          </p>
        </a>

        <div className="block border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="mb-3 flex h-14 w-14 items-center justify-center bg-orange-600/10">
            <MessageSquare className="text-orange-500" size={24} />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            What We Can Help With
          </div>
          <ul className="mt-3 space-y-2 text-xs text-zinc-400">
            <li className="flex items-start gap-2">
              <Dumbbell className="mt-0.5 h-3 w-3 shrink-0 text-orange-500" />
              Product review questions or corrections
            </li>
            <li className="flex items-start gap-2">
              <Dumbbell className="mt-0.5 h-3 w-3 shrink-0 text-orange-500" />
              Equipment suggestions for testing
            </li>
            <li className="flex items-start gap-2">
              <Dumbbell className="mt-0.5 h-3 w-3 shrink-0 text-orange-500" />
              Home gym build advice
            </li>
            <li className="flex items-start gap-2">
              <Dumbbell className="mt-0.5 h-3 w-3 shrink-0 text-orange-500" />
              Partnership and advertising inquiries
            </li>
            <li className="flex items-start gap-2">
              <Dumbbell className="mt-0.5 h-3 w-3 shrink-0 text-orange-500" />
              Content corrections or feedback
            </li>
          </ul>
        </div>
      </div>

      {/* Additional info */}
      <div className="mt-10 border-t border-zinc-800 pt-10">
        <div className="prose prose-lg prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-p:text-zinc-400 prose-p:leading-relaxed prose-strong:text-zinc-200">
          <h2>Before You Reach Out</h2>
          <p>
            Looking for product recommendations? Check our{" "}
            <a href="/best-gear/">best gear guides</a> — we&apos;ve tested over
            200 products across every major home gym category. For specific
            budget planning, try our{" "}
            <a href="/calculator/">home gym calculator</a>.
          </p>
          <p>
            Want to know how we test products and make recommendations? Read our{" "}
            <a href="/how-we-test/">testing methodology</a> and{" "}
            <a href="/affiliate-disclosure/">affiliate disclosure</a>.
          </p>

          <h2>Press and Media</h2>
          <p>
            For press inquiries, interview requests, or media resources, email us
            at <strong>hello@garagegymbuilders.com</strong> with
            &quot;Press&quot; in the subject line.
          </p>
        </div>
      </div>
    </div>
  );
}
