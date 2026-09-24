import type { Metadata } from "next";
import Link from "next/link";
import { ContactLine, LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that apply when you use the JustCliks website.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of service">
      <p>
        These terms apply to your use of this website, run by JustCliks (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By using
        the site you agree to them. If you do not agree, please do not use the site.
      </p>

      <h2>About this website</h2>
      <p>
        This site tells you about our services and lets you send us a project enquiry. Sending a brief does not create
        a contract. Any work we do for you will be covered by a separate written agreement or quote, and that document
        takes priority over these terms.
      </p>

      <h2>Our work and content</h2>
      <p>
        The text, design, photos, videos and graphics on this site belong to JustCliks or to the clients and partners
        whose projects we show. Client names and work appear with their permission. You may view and share links to
        our pages, but you may not copy, download, edit or reuse our content for commercial purposes without written
        permission.
      </p>

      <h2>Using the site properly</h2>
      <p>You agree not to:</p>
      <ul>
        <li>send false, misleading or unlawful information through our forms</li>
        <li>try to disrupt, overload or gain unauthorised access to the site</li>
        <li>use automated tools to scrape or copy the site</li>
      </ul>

      <h2>Results</h2>
      <p>
        We describe past projects to show the kind of work we do. Every business and audience is different, so we
        cannot promise a particular number of followers, views, leads or sales from any campaign.
      </p>

      <h2>Links to other sites</h2>
      <p>
        We may link to social media platforms and other websites. We are not responsible for their content or
        privacy practices.
      </p>

      <h2>Availability</h2>
      <p>
        We try to keep the site available and accurate, but we provide it &ldquo;as is&rdquo; and may change, pause or
        remove any part of it at any time.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent the law allows, JustCliks is not liable for any indirect or consequential loss arising from your
        use of this website. Nothing in these terms limits any liability that cannot be limited under applicable law.
      </p>

      <h2>Privacy</h2>
      <p>
        How we handle information you send us is explained in our <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India. Any dispute will be handled by the courts of Tamil Nadu.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. The date at the top of the page shows the latest version.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? <ContactLine />.
      </p>
    </LegalPage>
  );
}
