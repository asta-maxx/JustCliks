import type { Metadata } from "next";
import { ContactLine, LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How JustCliks collects, uses and protects the information you share with us.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        This policy explains what information JustCliks (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects through this
        website, why we collect it and what you can ask us to do with it. We keep it short because we collect very
        little.
      </p>

      <h2>What we collect</h2>
      <p>When you send us a brief through the contact form, we receive:</p>
      <ul>
        <li>your name, and your business or brand name if you add it</li>
        <li>your phone number and/or email address</li>
        <li>the goal and services you picked, and anything you write in the message box</li>
        <li>the date and time you sent it</li>
      </ul>
      <p>
        Like most websites, our hosting provider automatically records basic technical data such as your IP address,
        browser type and the pages you requested. This is used to keep the site running and secure.
      </p>

      <h2>What we do not collect</h2>
      <p>
        We do not run advertising trackers or sell your information. The site stores one small value in your
        browser&rsquo;s session storage so the opening animation only plays once per visit. It is deleted when you
        close the tab and is never sent to us.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>to reply to your enquiry and discuss your project</li>
        <li>to prepare a proposal or quote if you ask for one</li>
        <li>to keep a record of the conversation if we go on to work together</li>
      </ul>
      <p>We will not add you to a mailing list or send you marketing unless you ask us to.</p>

      <h2>Who we share it with</h2>
      <p>
        We only share your information with service providers who help us run this website and receive enquiries,
        such as our web host and the tool that delivers form submissions to us. They may only use it to provide that
        service. We will also disclose information if the law requires it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        If we do not end up working together, we delete enquiry details within 12 months. If we do, we keep project
        records for as long as we need them for the work and for our legal and accounting obligations.
      </p>

      <h2>Your rights</h2>
      <p>
        Under India&rsquo;s Digital Personal Data Protection Act, 2023, and other laws that may apply to you, you can
        ask us to:
      </p>
      <ul>
        <li>tell you what personal information we hold about you</li>
        <li>correct or complete it</li>
        <li>delete it</li>
        <li>withdraw consent you gave earlier</li>
      </ul>
      <p>
        To make any of these requests, <ContactLine />. We will respond within a reasonable time. If you are not
        satisfied with our response, you may raise a complaint with the Data Protection Board of India.
      </p>

      <h2>Security</h2>
      <p>
        The site is served over an encrypted connection and we limit who can see enquiries. No method of sending
        information over the internet is completely secure, but we take reasonable steps to protect what you share.
      </p>

      <h2>Children</h2>
      <p>This website is meant for businesses and adults. We do not knowingly collect information from children.</p>

      <h2>Changes</h2>
      <p>
        If we change this policy we will update the date at the top of this page. Significant changes will be made
        clear on the site.
      </p>

      <h2>Contact</h2>
      <p>
        For any question about this policy or your information, <ContactLine />.
      </p>
    </LegalPage>
  );
}
