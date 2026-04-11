import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "FTC affiliate disclosure for GarageGymBuilder. Learn how we earn commissions.",
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      <h1 className="mb-8 text-4xl font-black uppercase italic tracking-tighter">
        Affiliate Disclosure
      </h1>

      <div className="prose prose-lg prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-p:text-zinc-400 prose-p:leading-relaxed prose-strong:text-zinc-200">
        <p>
          <strong>Last updated:</strong> April 10, 2026
        </p>

        <h2>FTC Disclosure</h2>
        <p>
          GarageGymBuilder is a participant in the Amazon Services LLC Associates
          Program, an affiliate advertising program designed to provide a means
          for sites to earn advertising fees by advertising and linking to
          Amazon.com.
        </p>
        <p>
          We are also a participant in the Walmart Associates Program and may
          earn commissions from qualifying purchases made through links to
          Walmart.com.
        </p>

        <h2>How Affiliate Links Work</h2>
        <p>
          When you click on a product link on our site and make a purchase, we
          may receive a small commission at <strong>no additional cost</strong>{" "}
          to you. This commission helps us keep the site running, test new
          products, and produce free content.
        </p>

        <h2>Our Editorial Independence</h2>
        <p>
          Affiliate commissions do not influence our product recommendations.
          Our reviews and rankings are based on hands-on testing, research, and
          our honest opinions. We will never recommend a product solely because
          it pays a higher commission.
        </p>

        <h2>Product Pricing</h2>
        <p>
          Prices shown on GarageGymBuilder are accurate at the time of
          publication but may change. We recommend checking the current price on
          the retailer&apos;s website before purchasing.
        </p>

        <h2>Questions?</h2>
        <p>
          If you have any questions about our affiliate relationships, please
          contact us at <strong>hello@garagegymbuilders.com</strong>.
        </p>
      </div>
    </div>
  );
}
