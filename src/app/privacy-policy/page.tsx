import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "GarageGymBuilder privacy policy and data handling practices.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      <h1 className="mb-8 text-4xl font-black uppercase italic tracking-tighter">
        Privacy Policy
      </h1>

      <div className="prose prose-lg prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-p:text-zinc-400 prose-p:leading-relaxed prose-strong:text-zinc-200">
        <p>
          <strong>Last updated:</strong> April 10, 2026
        </p>

        <h2>Information We Collect</h2>
        <p>
          GarageGymBuilder is a static website. We do not collect personal
          information directly. However, we use third-party services that may
          collect data as described below.
        </p>

        <h2>Analytics</h2>
        <p>
          We may use analytics services to understand how visitors use our site.
          These services may collect information such as your IP address, browser
          type, pages visited, and time spent on the site.
        </p>

        <h2>Affiliate Links</h2>
        <p>
          Our site contains affiliate links to Amazon.com, Walmart.com, and other
          retailers. When you click these links, the respective retailer may
          place cookies on your device to track the referral.
        </p>

        <h2>Cookies</h2>
        <p>
          We may use cookies for analytics purposes. You can control cookie
          settings through your browser preferences.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. Changes will be
          posted on this page with an updated revision date.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this privacy policy? Contact us at{" "}
          <strong>hello@garagegymbuilder.com</strong>.
        </p>
      </div>
    </div>
  );
}
