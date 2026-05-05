import { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "Terms of service and conditions of use for GarageGymBuilders.com.",
  path: "/terms-of-service/",
  keywords: ["terms of service", "terms and conditions", "legal"],
});

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
      <h1 className="mb-8 text-4xl font-black uppercase italic tracking-tighter">
        Terms of Service
      </h1>

      <div className="prose prose-lg prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-p:text-zinc-400 prose-p:leading-relaxed prose-strong:text-zinc-200">
        <p>
          <strong>Last updated:</strong> May 5, 2026
        </p>

        <p>
          Welcome to GarageGymBuilders (&quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;). By accessing or using our website at
          garagegymbuilders.com (the &quot;Site&quot;), you agree to be bound by
          these Terms of Service (&quot;Terms&quot;). If you do not agree to
          these Terms, please do not use the Site.
        </p>

        <h2>Use of the Site</h2>
        <p>
          You may use the Site for lawful purposes only. You agree not to use
          the Site in any way that violates applicable local, state, national, or
          international law or regulation. You may not attempt to gain
          unauthorized access to any portion of the Site, other accounts, computer
          systems, or networks connected to the Site.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on this Site — including text, graphics, logos, images,
          photographs, reviews, and data compilations — is the property of
          GarageGymBuilders or its content suppliers and is protected by United
          States and international copyright laws. You may not reproduce,
          distribute, modify, create derivative works of, publicly display, or
          publicly perform any content from this Site without our prior written
          consent.
        </p>

        <h2>Product Information and Reviews</h2>
        <p>
          Our reviews, ratings, and recommendations are based on hands-on testing
          and the honest opinions of our editorial team. Product information
          including pricing, specifications, and availability is provided for
          informational purposes only and is accurate to the best of our
          knowledge at the time of publication. We make no guarantees regarding
          the accuracy, completeness, or timeliness of product information.
          Always verify current pricing and specifications with the retailer
          before making a purchase.
        </p>

        <h2>Affiliate Links and Third-Party Sites</h2>
        <p>
          Our Site contains affiliate links to third-party retailers including
          Amazon.com. When you click an affiliate link and make a purchase, we may
          earn a commission at no additional cost to you. These affiliate
          relationships do not influence our editorial content or product
          recommendations. We are not responsible for the content, privacy
          practices, or terms of any third-party websites. Your interactions with
          third-party sites are governed by their respective terms and policies.
          For full details, see our{" "}
          <a href="/affiliate-disclosure/">Affiliate Disclosure</a>.
        </p>

        <h2>Disclaimer of Warranties</h2>
        <p>
          The Site and its content are provided on an &quot;as is&quot; and
          &quot;as available&quot; basis without warranties of any kind, either
          express or implied. We do not warrant that the Site will be
          uninterrupted, error-free, or free of viruses or other harmful
          components. We disclaim all warranties, including but not limited to
          implied warranties of merchantability, fitness for a particular
          purpose, and non-infringement.
        </p>

        <h2>Fitness and Health Disclaimer</h2>
        <p>
          Content on this Site is for informational and educational purposes only
          and is not intended as medical advice, diagnosis, or treatment. Exercise
          programs and equipment use carry inherent risks. Consult a qualified
          healthcare provider before starting any exercise program or using gym
          equipment, especially if you have pre-existing health conditions. We are
          not liable for any injury, loss, or damage arising from the use of
          information or recommendations on this Site.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, GarageGymBuilders
          and its team members, contributors, and affiliates shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages, including without limitation loss of profits, data, use,
          goodwill, or other intangible losses, arising out of or in connection
          with your use of the Site.
        </p>

        <h2>User Conduct</h2>
        <p>
          You agree not to: (a) use the Site to transmit spam, chain letters, or
          unsolicited communications; (b) impersonate any person or entity; (c)
          interfere with or disrupt the Site or servers or networks connected to
          the Site; (d) collect or store personal data about other users without
          their consent; or (e) use automated tools, bots, or scrapers to access
          the Site without our written permission.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Changes will be
          posted on this page with an updated revision date. Your continued use
          of the Site after any changes constitutes acceptance of the revised
          Terms. We encourage you to review these Terms periodically.
        </p>

        <h2>Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the United States, without regard to conflict of law
          principles.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about these Terms of Service, please contact us
          at <strong>hello@garagegymbuilders.com</strong>.
        </p>
      </div>
    </div>
  );
}
